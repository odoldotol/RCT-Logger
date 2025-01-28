import { EventEmitter } from "stream";

export interface ClientUSBStorageInterfaceI
  extends EventEmitter<ClientUSBStorageInterfaceEventMap>
{
  isMounted(): boolean;
}

type ClientUSBStorageInterfaceEventMap = {
  [K in ClientUSBStorageInterfaceEvent]: []
};

export const enum ClientUSBStorageInterfaceEvent {
  Mounted = "mounted",
  Unmounted = "unmounted",
  Done = "done",
}
