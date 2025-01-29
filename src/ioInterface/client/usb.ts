import {
  Logger,
} from "src/common";
import { EventEmitter } from "stream";

/**
 * 초기화떄 마운트된 USBStorage 없음.
 * usb 포트 감지 시작하면, 마운트된 스토리지 검색해서 Mounted 이벤트 주자.
 */
export class ClientUSBStorageInterface
  extends EventEmitter<ClientUSBStorageInterfaceEventMap>
{
  private readonly logger = new Logger(ClientUSBStorageInterface.name);
  private readonly mountedUSBStorageSet = new Set<USBStorage>();

  constructor() {
    super();

    this.on(ClientUSBStorageInterfaceEvent.Mounted, (usb) => {
      this.mountedUSBStorageSet.add(usb);
    });

    this.on(ClientUSBStorageInterfaceEvent.Unmounted, (usb) => {
      this.mountedUSBStorageSet.delete(usb) || this.logger.warn(`Unmounted USBStorage not found: ${usb}`);
      if (this.mountedUSBStorageSet.size == 0) {
        this.emit(ClientUSBStorageInterfaceEvent.AllUnmounted, usb);
      }
    });
  }

  public isMounted(usb: USBStorage): boolean {
    return this.mountedUSBStorageSet.has(usb);
  }

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