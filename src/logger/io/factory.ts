import { IOInterface } from "../ioInterface/ioInterface";
import { IO } from "./io";
import { ReceiverStatus } from "./receiver/status";
import { RCTProtocol } from "./receiver/rctProtocol";
import { Receiver } from "./receiver";

import { Config } from "../../config/init";
import { Usb } from "./usb";
import { UsbStorageContainer } from "./usb/storage.container";

class IOFactoryStatic {

  public create(ioInterface: IOInterface) {
    const status = new ReceiverStatus(Config.gpioConfigService);
    const rctProtocol = new RCTProtocol();

    const receiver = new Receiver(
      status,
      rctProtocol,
      ioInterface.receiver
    );

    const usbStorageContainer = new UsbStorageContainer();
    const usb = new Usb(
      usbStorageContainer,
      ioInterface.usbStorage
    );

    return new IO(
      receiver,
      usb
    );
  }

}

export const IOFactory = new IOFactoryStatic();