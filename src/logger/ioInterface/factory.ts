import { LedGpioName } from "../../config";
import { IOInterface } from "./ioInterface";
import {
  LedInterface,
  LEDInterfaceContainer
} from "./led";
import { ReceiverInterface } from "./receiver";
import { UsbStorageInterface } from "./usb";
import { Config } from "../../config/init";


class IOInterfaceFactoryStatic {

  public create(): IOInterface {
    const receiver = new ReceiverInterface();
    const usbStorage = new UsbStorageInterface();

    const ledMap = new Map<LedGpioName, LedInterface>(
      Config.gpioConfigService.getLedGpioKeys()
      .map(ledGpioName => [ ledGpioName, new LedInterface() ])
    );

    const ledContainer = new LEDInterfaceContainer(ledMap);

    return new IOInterface(
      receiver,
      usbStorage,
      ledContainer,
    );
  }

}

export const IOInterfaceFactory = new IOInterfaceFactoryStatic();