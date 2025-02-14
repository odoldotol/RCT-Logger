import { EventEmitter } from "stream";
import { DEVNAME } from "../../io/usb";
import { MountedDir } from "../../io/usb/storage";

/**
 * 
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
