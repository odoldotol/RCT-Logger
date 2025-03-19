import { IOInterface } from "../ioInterface/ioInterface";
import { IO } from "./io";
import { ReceiverStatus } from "./receiver/status";
import { RCTProtocol } from "./receiver/rctProtocol";
import { Receiver } from "./receiver";
import { Config } from "../../config/init";
import { Usb } from "./usb";
import { UsbStorageContainer } from "./usb/storage.container";
import {
  Led,
  LedContainer
} from "./led";
import { LedGpioName } from "../../config";
import { Ar20 } from "./receiver/status/ar20";
import { ChildMaster as SerialChildMaster } from "./receiver/serial";


class IOFactoryStatic {

  public create(ioInterface: IOInterface) {
    const ar20 = new Ar20(Config.gpioConfigService);

    const serialChild = new SerialChildMaster();
    const receiverStatus = new ReceiverStatus(ar20);
    const rctProtocol = new RCTProtocol();

    const receiver = new Receiver(
      serialChild,
      receiverStatus,
      rctProtocol,
      ioInterface.receiver,
      ioInterface.ledContainer.get(LedGpioName.Test)
    );

    const usbStorageContainer = new UsbStorageContainer();

    const usb = new Usb(
      usbStorageContainer,
      ioInterface.usbStorage,
      ioInterface.ledContainer.get(LedGpioName.Green),
      ioInterface.ledContainer.get(LedGpioName.Red),
    );

    const ledMap = new Map<LedGpioName, Led>();
    for (const [ name, config ] of Config.gpioConfigService.getLedGpioConfigIterator()) {
      ledMap.set(name, new Led(
        config,
        ioInterface.ledContainer.get(name)
      ));
    }

    const ledContainer = new LedContainer(ledMap);

    return new IO(
      receiver,
      usb,
      ledContainer,
    );
  }

}

export const IOFactory = new IOFactoryStatic();