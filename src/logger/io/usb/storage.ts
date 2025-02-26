import {
  ACTION,
  KernelName,
  UdevBlockEvent
} from ".";
import {
  DEVNAME,
  MountedDir
} from "../../ioInterface";

export class UsbStorage {

  public readonly deviceName: DEVNAME;
  public readonly kernelName: KernelName;
  public readonly mountPoint: MountPoint;

  private readonly udevBlockEventList: UdevBlockEvent[] = [];

  private mountedDir: MountedDir | null = null;

  constructor(
    udevAddBlockEvent: UdevBlockEvent<ACTION.Add>,
  ) {
    this.deviceName = udevAddBlockEvent.DEVNAME;
    this.kernelName = this.deviceName.split("/").pop()!;
    this.mountPoint = MOUNT_ROOT + this.kernelName as MountPoint;

    this.udevBlockEventList.push(udevAddBlockEvent);
  }

  public pushUdevBlockEvent(udevBlockEvent: UdevBlockEvent): this {
    this.udevBlockEventList.push(udevBlockEvent);
    return this;
  }

  public removeMountedDir(): this {
    this.mountedDir = null;
    return this;
  }

  public setMountedDir(mountedDir: MountedDir) {
    return this.mountedDir = mountedDir;
  }

  public getMountedDir(): MountedDir | null {
    return this.mountedDir;
  }

}

export type MountPoint = `${typeof MOUNT_ROOT}${KernelName}`;

const MOUNT_ROOT = "/mnt/usb-";