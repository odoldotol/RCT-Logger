import { GpioName } from "src/common";
import { IOInterface } from "../ioInterface/ioInterface";
import { IO } from "./io";

import { Config } from "src/config/init";
import { ReceiverStatus } from "./receiver/status";
import { RCTProtocol } from "./receiver/rctProtocol";
import { Receiver } from "./receiver";

class IOFactoryStatic {

  public create(ioInterface: IOInterface) {
    const AR20Gpio = Config.gpioConfigService.getGpio(GpioName.RECEIVER_AR20);

    const status = new ReceiverStatus(AR20Gpio);
    const rctProtocol = new RCTProtocol();

    const receiver = new Receiver(
      status,
      rctProtocol,
      ioInterface.receiver
    );

    return new IO(
      receiver
    );
  }

}

export const IOFactory = new IOFactoryStatic();