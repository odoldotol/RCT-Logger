import {
  IO,
  Logger
} from "../../../common";
import {
  UsbStorageInterface,
  UsbStorageInterfaceEvent
} from "../../ioInterface";
import { UsbStorageContainer } from "./storage.container";

const Udev = require("udev");

/**
 * 하나의 USB 스토리지만 허용함.
 * 
 * ### test
 * - 삽입, 마운트, 완료, 언마운트, 제거
 * - 삽입, 마운트, 에러, 언마운트, 제거
 * - 삽입, 삽입, 삽입, ... , 제거, 제거, 제거 (최초 하나만 처리)
 * - 삽입, 마운트, 제거, 언마운트, 에러
 */
export class Usb
  implements IO
{
  private readonly logger = new Logger(Usb.name);

  private readonly blockMonitor = Udev.monitor("block");
  
  constructor(
    private readonly usbStorageContainer: UsbStorageContainer,
    private readonly usbStorageInterface: UsbStorageInterface
  ) {}

  public open() {
    this.listenUdev();
    this.listenInterface();
  }

  public async close() {
    this.blockMonitor.removeAllListeners();
    await this.usbStorageContainer.clear();
  }

  private listenUdev() {
    this.blockMonitor.on(ACTION.Add, (event: UdevBlockEvent<ACTION.Add>) => {
      if (
        this.isUsbPartitionEvent(event) &&
        this.usbStorageContainer.size == 0 // 더 정확히, '마운트된 스토리지(MountedDir != null)가 없으면' 으로 치환 가능.
      ) {
        this.usbStorageContainer.add(event)
        .then(usbStorage => {
          const mountedDir = usbStorage.getMountedDir();

          if (mountedDir == null) {
            throw new Error(`Add Error: MountedDir is null: ${usbStorage.deviceName}`);
          }

          this.logger.log(`Udev[Add]: Added and Mounted ${usbStorage.deviceName} ${mountedDir}`); // LED G Blink

          this.usbStorageInterface.emit(
            UsbStorageInterfaceEvent.Mounted,
            usbStorage.deviceName,
            mountedDir
          );
        })
        .catch(e => {
          this.logger.error(`Failed to Add`, e); // LED G OFF Y ON
        });
      }
    });

    this.blockMonitor.on(ACTION.Remove, (event: UdevBlockEvent<ACTION.Remove>) => {
      if (this.isUsbPartitionEvent(event)) {

        const usbStorage = this.usbStorageContainer.find(event);

        if (usbStorage == null) {
          this.logger.warn(`Can Not Remove Device. No UsbStorage in Container: ${event.DEVNAME}`);
          return;
        }

        const mountedDir = usbStorage.getMountedDir();
        if (mountedDir != null) {
          this.usbStorageContainer.umount(usbStorage)
          .then(() => {
            this.logger.warn(`Udev[Remove] Umounted ${usbStorage.deviceName}`);
            this.usbStorageInterface.emit(UsbStorageInterfaceEvent.Umounted, usbStorage.deviceName);
          })
          .catch(e => {
            this.logger.error(`Failed to Umount on Remove`, e); // LED G Y
          });
        }

        this.usbStorageContainer.remove(event);

        this.logger.log(`Udev[Remove] Removed ${usbStorage.deviceName}`);
        
        // 전부 제거된경우엔 LED G OFF Y OFF
      }
    });
  }

  private listenInterface() {
    this.usbStorageInterface.on(UsbStorageInterfaceEvent.Complete, (deviceName: DEVNAME) => {
      if (this.usbStorageContainer.has(deviceName)) {
        this.usbStorageContainer.umount(deviceName)
        .then((usbStorage) => {
          this.logger.log(`Complete and Umounted: ${usbStorage.deviceName}`); // LED G ON Y OFF
          this.usbStorageInterface.emit(UsbStorageInterfaceEvent.Umounted, usbStorage.deviceName);
        })
        .catch(e => {
          this.logger.error(`Complete, But Failed to Umount: ${deviceName}`, e); // LED G OFF Y ON
        });
      } else {
        this.logger.error(`Complete, ButNo UsbStorage in Container: ${deviceName}`); // LED G OFF Y ON
      }
    });

    this.usbStorageInterface.on(UsbStorageInterfaceEvent.Error, (deviceName: DEVNAME) => {
      if (this.usbStorageContainer.has(deviceName)) {
        this.usbStorageContainer.umount(deviceName)
        .then((usbStorage) => {
          this.logger.log(`Error and Umounted: ${usbStorage.deviceName}`); // LED G OFF Y ON
          this.usbStorageInterface.emit(UsbStorageInterfaceEvent.Umounted, usbStorage.deviceName);
        })
        .catch(e => {
          this.logger.error(`Error, But Failed to Umount: ${deviceName}`, e); // LED G OFF Y ON
        });
      } else {
        this.logger.warn(`Error, No UsbStorage in Container: ${deviceName}`); // LED G OFF Y ON

        // 전부 제거된경우엔 LED G OFF Y OFF
      }
    });
  }

  private isUsbPartitionEvent(event: UdevBlockEvent): boolean {
    return event.ID_BUS == "usb" &&
      event.DEVTYPE == "partition" &&
      event.SUBSYSTEM == "block";
  }

}

/**
 * @prop ID_PATH | DEVPATH => port 유추 가능
 */
export type UdevBlockEvent<T extends ACTION = ACTION> = {
  ACTION: T;
  DEVNAME: DEVNAME;
  DEVPATH: string;
  DEVTYPE: string;
  ID_BUS: string;
  ID_PATH: string;
  SUBSYSTEM: "block";
  [key: string]: string;
}

export const enum ACTION {
  Add = "add",
  Remove = "remove",
  Change = "change",
}

export type DEVNAME = `/dev/${KernelName}`;

export type KernelName = string;