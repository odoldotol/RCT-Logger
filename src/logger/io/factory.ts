import { IOInterface } from "../ioInterface/ioInterface";
import { IO } from "./io";
import { ReceiverStatus } from "./receiver/status";
import { RCTProtocol } from "./receiver/rctProtocol";
import { Receiver } from "./receiver";

import { Config } from "../../config/init";

class IOFactoryStatic {

  public create(ioInterface: IOInterface) {
    const status = new ReceiverStatus(Config.gpioConfigService);
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