import { exec } from "child_process";
import {
  mkdir,
  rmdir
} from "fs/promises";
import {
  ACTION,
  UdevBlockEvent
} from ".";
import {
  MountPoint,
  UsbStorage
} from "./storage";
import { Logger } from "../../../common";
import {
  DEVNAME,
  MountedDir
} from "../../ioInterface";

/**
 * 초기에 다수의 USB 스토리지를 처리할 수 있도록 디자인하였으나 하나만 처리해도 충분, 다수 처리는 불필요.
 */
export class UsbStorageContainer {

  private readonly logger = new Logger(UsbStorageContainer.name);

  private readonly container = new Map<DEVNAME, UsbStorage>();

  public get size(): number {
    return this.container.size;
  }

  /**
   * 전부 언마운트하고 마운트 포인트 삭제하고 컨테이너 비움.
   */
  public async clear() {
    this.container.clear();
  }

  public remove(udevRemoveBlockEvent: UdevBlockEvent<ACTION.Remove>): UsbStorage | null {
    const usbStorage = this.container.get(udevRemoveBlockEvent.DEVNAME);
    
    this.container.delete(udevRemoveBlockEvent.DEVNAME);

    if (usbStorage) {
      usbStorage.pushUdevBlockEvent(udevRemoveBlockEvent);
      return usbStorage;
    } else {
      return null;
    }
  }

  /**
   * mount, container에 추가
   */
  public async add(udevAddBlockEvent: UdevBlockEvent<ACTION.Add>): Promise<UsbStorage> {
    const usbStorage = new UsbStorage(udevAddBlockEvent);

    if (this.has(usbStorage)) {
      throw new Error(`Can Not Add Device. Already exists: ${usbStorage.deviceName}`);
    }

    this.container.set(usbStorage.deviceName, usbStorage);

    await this.mount(usbStorage);

    return usbStorage;
  }

  public has(deviceName: DEVNAME): boolean;
  public has(udevAddBlockEvent: UdevBlockEvent): boolean;
  public has(usbStorage: UsbStorage): boolean;
  public has(arg: UsbStorage | UdevBlockEvent | DEVNAME): boolean {
    let deviceName: DEVNAME;
    if (arg instanceof UsbStorage) {
      deviceName = arg.deviceName;
    } else if (typeof arg === "string") {
      deviceName = arg;
    } else {
      deviceName = arg.DEVNAME;
    }

    return this.container.has(deviceName);
  }

  public find(udevAddBlockEvent: UdevBlockEvent): UsbStorage | null {
    return this.container.get(udevAddBlockEvent.DEVNAME) ?? null;
  }
  
  public async umount(deviceName: DEVNAME): Promise<UsbStorage>;
  public async umount(usbStorage: UsbStorage): Promise<UsbStorage>;
  public async umount(arg: DEVNAME | UsbStorage): Promise<UsbStorage> {
    let deviceName: DEVNAME;
    let usbStorage: UsbStorage;

    if (arg instanceof UsbStorage) {
      deviceName = arg.deviceName;
      usbStorage = arg;
    } else {
      deviceName = arg;

      const usbStorageTemp = this.container.get(deviceName);
      if (usbStorageTemp == undefined) {
        throw new Error(`Can Not Umount Device. Not Found: ${deviceName}`);
      } else {
        usbStorage = usbStorageTemp;
      }
    }

    const mountedDir = usbStorage.getMountedDir();

    if (mountedDir == null) {
      this.logger.warn(`Already Umounted: ${deviceName}`);
      return usbStorage;
    }

    return new Promise<void>((resolve, reject) => {
      exec(`umount ${mountedDir}`, (
        err,
        stdout,
        stderr
      ) => {
        if (err) {
          return reject(err);
        }

        if (stderr) {
          return reject(stderr);
        }

        if (stdout == "") {
          return resolve();
        } else {
          return reject(stdout);
        }
      });
    }).then(() => {
      return usbStorage.removeMountedDir();
    }).finally(() => {
      this.removeMountPoint(mountedDir);
    });
  }

  /**
   * @todo 이미 사용중이라서 실패시 별칭으로 mountPoint 만들어서 마운트하기?
   */
  private async mount(usbStorage: UsbStorage): Promise<MountedDir> {
    const mountPoint = await this.createMountPoint(usbStorage);

    return new Promise<MountedDir>((resolve, reject) => {
      exec(`mount ${usbStorage.deviceName} ${mountPoint}`, (
        err,
        stdout,
        stderr
      ) => {
        if (err) {
          return reject(err);
        }

        if (stderr) {
          return reject(stderr);
        }

        if (stdout == "") {
          return resolve(mountPoint);
        } else {
          return reject(stdout);
        }
      });
    }).then((mountedDir) => {
      return usbStorage.setMountedDir(mountedDir);
    }).catch(async (err) => {
      await this.removeMountPoint(mountPoint);
      throw err;
    });
  }

  private createMountPoint(usbStorage: UsbStorage): Promise<MountPoint> {
    return mkdir(usbStorage.mountPoint, { recursive: true }).then(() => usbStorage.mountPoint);
  }

  private removeMountPoint(mountPoint: MountPoint | MountedDir): Promise<void> {
    return rmdir(mountPoint).catch(err => this.logger.warn(err));
  }

}
