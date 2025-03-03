import {
  IO,
  Logger
} from "../../../common";
import {
  DEVNAME,
  LedInterface,
  UsbStorageInterface,
  UsbStorageInterfaceEvent
} from "../../ioInterface";
import { UsbStorageContainer } from "./storage.container";

const Udev = require("udev");

/**
 * 제한적 구현: 하나의 USB 스토리지만 허용.
 * 
 * @todo 코드 컴팩션, 다수의 USBStorage 를 허용하려한 초기 디자인 자체가 문제. 디자인 자채를 다시 해야함.
 */
export class Usb
  implements IO
{
  private readonly logger = new Logger(Usb.name);

  private readonly blockMonitor = Udev.monitor("block");
  
  constructor(
    private readonly usbStorageContainer: UsbStorageContainer,
    private readonly usbStorageInterface: UsbStorageInterface,
    private readonly greenLedInterface: LedInterface,
    private readonly redLedInterface: LedInterface,
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
    this.blockMonitor.on(ACTION.Add, (
      event: UdevBlockEvent<ACTION.Add>
    ) => {
      if (
        this.isUsbPartitionEvent(event) == false ||
        this.usbStorageContainer.size != 0 // 더 정확히, '마운트된 스토리지(MountedDir != null)가 없으면' 으로 치환 가능.
      ) {
        return;
      }

      this.logger.log(`Udev(Add): ${event.DEVNAME}`);

      const usbStorage = this.usbStorageContainer.add(event);

      this.usbStorageContainer.mount(usbStorage)
      .then(mountedDir => {
        this.greenLedInterface.blink(500);

        this.usbStorageInterface.emit(
          UsbStorageInterfaceEvent.Mounted,
          usbStorage.deviceName,
          mountedDir
        );
      })
      .catch(e => {
        this.logger.error(`Failed to Mount on Add ${event.DEVNAME}`, e);
        this.greenLedInterface.off();
        this.redLedInterface.on();
      });
    });

    this.blockMonitor.on(ACTION.Remove, (
      event: UdevBlockEvent<ACTION.Remove>
    ) => {      
      if (this.isUsbPartitionEvent(event) == false) {
        return;
      }

      this.logger.log(`Udev(Remove): ${event.DEVNAME}`);

      const usbStorage = this.usbStorageContainer.find(event);

      const led = () => {
        if (this.usbStorageContainer.size == 0) {
          this.greenLedInterface.off();
          this.redLedInterface.off();
        }
      };

      if (usbStorage == null) {
        this.logger.warn(`Can Not Remove Device. No UsbStorage in Container: ${event.DEVNAME}`);
        led();
        return;
      }

      const remove = () => {
        this.usbStorageContainer.remove(event);
        led();
      };

      const mountedDir = usbStorage.getMountedDir();
      if (mountedDir != null) { // 비정상 제거
        setTimeout(() => {
          this.usbStorageContainer.umount(usbStorage)
          .catch(e => {
            this.logger.error(`Failed to Umount on Remove ${mountedDir}`, e);
          })
          .finally(() => {
            remove();
          });
        }, 3000);
      } else {
        remove();
      }
    });
  }

  private listenInterface() {
    this.usbStorageInterface.on(UsbStorageInterfaceEvent.Complete, (deviceName: DEVNAME) => {
      if (this.usbStorageContainer.has(deviceName)) {
        this.usbStorageContainer.umount(deviceName)
        .then((_usbStorage) => {
          this.greenLedInterface.on();
          this.redLedInterface.off();
        })
        .catch(e => {
          this.logger.error(`Complete, But Failed to Umount: ${deviceName}`, e);
          this.greenLedInterface.on();
          this.redLedInterface.on();
        });
      } else {
        this.logger.error(`Complete, But No UsbStorage in Container: ${deviceName}`);
        this.greenLedInterface.on();
        this.redLedInterface.on();
      }
    });

    this.usbStorageInterface.on(UsbStorageInterfaceEvent.Error, async (
      deviceName: DEVNAME,
      _mountedDir: unknown,
      error: any
    ) => {
      // Todo: 가능하다면 txt 쓰기
      this.logger.error(`Error: ${deviceName}`, error);

      if (this.usbStorageContainer.has(deviceName)) {
        await this.usbStorageContainer.umount(deviceName)
        .catch(e => {
          this.logger.error(`Error, But Failed to Umount: ${deviceName}`, e);
        });
      } else {
        this.logger.warn(`Error, But No UsbStorage in Container: ${deviceName}`);
      }

      this.greenLedInterface.off();
      if (this.usbStorageContainer.size == 0) {
        this.redLedInterface.off();
      } else {
        this.redLedInterface.on();
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

export type KernelName = string;