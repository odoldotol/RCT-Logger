import { EventEmitter } from "stream";
import { KernelName } from "../../io/usb";
import { MountPoint } from "../../io/usb/storage";
import {
  ErrorEventMap,
  Logger
} from "../../../common";

/**
 * @todo 더 안전하게
 */
export class UsbStorageInterface
  extends EventEmitter<UsbStorageInterfaceEventMap | ErrorEventMap>
{
  private readonly logger = new Logger(UsbStorageInterface.name);

  constructor() {
    super();

    this.on("error", (err) => {
      this.logger.error('Emitted Event: "error"', err);
    });
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