import { Config } from "../../../../config/init";
import { ReceiverSerial } from "./serial";
import { ReceiverSerialClk } from "./clk";
import { ReceiverSerialData } from "./data";
import { SlaveLogger } from "./child/slave";

class ReceiverSerialFactoryStatic {

  private readonly Logger = SlaveLogger;

  public create(): ReceiverSerial {
    const serialClkLogger = new this.Logger('SerialClk');
    const receiverSerialClk = new ReceiverSerialClk(
      Config.gpioConfigService,
      serialClkLogger,
    );
    
    const serialDataLogger = new this.Logger('SerialData');
    const receiverSerialData = new ReceiverSerialData(
      Config.gpioConfigService,
      serialDataLogger,
    );

    return new ReceiverSerial(
      receiverSerialClk,
      receiverSerialData,
    );
  }

}

export const ReceiverSerialFactory = new ReceiverSerialFactoryStatic();