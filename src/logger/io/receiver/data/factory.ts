import { Config } from "../../../../config/init";
import { ReceiverData } from ".";
import { ReceiverSerialClk } from "./clk";
import { ReceiverSerial } from "./serial";
import { GpioName } from "../../../../common";

class ReceiverDataFactoryStatic {

  public create(): ReceiverData {
    const receiverSerialClk = new ReceiverSerialClk(Config.gpioConfigService.getGpio(GpioName.RECEIVER_SERIAL_CLK));
    const receiverSerial = new ReceiverSerial(Config.gpioConfigService.getGpio(GpioName.RECEIVER_SERIAL));

    return new ReceiverData(
      receiverSerialClk,
      receiverSerial
    );
  }

}

export const ReceiverDataFactory = new ReceiverDataFactoryStatic();