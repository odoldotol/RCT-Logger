import { GpioName, IO } from "src/common";
import { Gpio } from "../../gpio";
import { GpioConfig } from "src/config";


export class SyncClk
  extends Gpio
  implements IO
{
  constructor(
    gpioConfig: GpioConfig,
  ) {
    super(
      gpioConfig,
      GpioName.RECEIVER_SERIAL_CLK
    );
  }

  public open() {
    this.enableAlert();
  }

  public close() {
    this.disableAlert();
    this.removeAllListeners();
  }

}
