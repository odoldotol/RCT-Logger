import { EventEmitter } from "stream";
import { KernelName } from "../../io/usb";
import { MountPoint } from "../../io/usb/storage";

/**
 * @todo 더 안전하게
 */
export class UsbStorageInterface
  extends EventEmitter<UsbStorageInterfaceEventMap>
{
  constructor() {
    super();
  }

}

export type UsbStorageInterfaceEventMap = {
  [UsbStorageInterfaceEvent.Mounted]: [DEVNAME, MountedDir];
  [UsbStorageInterfaceEvent.Umounted]: [DEVNAME];
  [UsbStorageInterfaceEvent.Complete]: [DEVNAME, MountedDir];
  [UsbStorageInterfaceEvent.Error]: [DEVNAME, MountedDir];
};

export const enum UsbStorageInterfaceEvent {
  Mounted,
  Umounted,
  Complete,
  Error,
}

export type DEVNAME = `/dev/${KernelName}`;

export type MountedDir = `${MountPoint}${string}`;