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
      ioInterface.usbStorage,
      ioInterface.ledContainer.get(LedGpioName.DownloadGreen),
      ioInterface.ledContainer.get(LedGpioName.DownloadYellow),
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