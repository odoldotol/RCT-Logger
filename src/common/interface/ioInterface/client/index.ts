import { ClientUSBStorageInterfaceI } from "./usb";

export interface ClientInterfaceI {
  USB: ClientUSBStorageInterfaceI;
}

export * from "./usb";