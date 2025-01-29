import { EventEmitter } from "stream";

export interface ClientUSBStorageInterfaceI
  extends EventEmitter<ClientUSBStorageInterfaceEventMap>
{
  isMounted(usb: USBStorage): boolean;
}

export type ClientUSBStorageInterfaceEventMap = {
  [K in ClientUSBStorageInterfaceEvent]: [USBStorage];
};

export const enum ClientUSBStorageInterfaceEvent {
  Mounted = "mounted",
  Unmounted = "unmounted",
  Done = "done",
  AllUnmounted = "allUnmounted",
}

export type USBStorage = {
  dir: string;
  // TODO: Add more properties
};