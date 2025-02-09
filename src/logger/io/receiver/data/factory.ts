import { Config } from "../../../../config/init";
import { ReceiverData } from ".";
import { ReceiverSerialClk } from "./clk";
import { ReceiverSerial } from "./serial";
import { Child } from "../child";

class ReceiverDataFactoryStatic {

  public create(): ReceiverData {
    const receiverSerialClk = new ReceiverSerialClk(
      Config.gpioConfigService,
      Child.logHandler,
    );
    
    const receiverSerial = new ReceiverSerial(
      Config.gpioConfigService,
      Child.logHandler,
    );

    return new ReceiverData(
      receiverSerialClk,
      receiverSerial,
      Child.dataHandler,
      Child.logHandler,
      Child.errorHandler,
    );
  }

}

export const ReceiverDataFactory = new ReceiverDataFactoryStatic();