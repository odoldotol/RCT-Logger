import { Config } from "src/config/init";
import { ReceiverData } from ".";
import { ReceiverSerialClk } from "./clk";
import { ReceiverSerial } from "./serial";
import { GpioName } from "src/common";

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