import { GpioConfig } from "src/config";
import { GpioPigpio } from "src/logger/io/gpio";

export class ReceiverSerial
  extends GpioPigpio
{
  /**
   * @param gpioConfig RECEIVER_SERIAL
   */
  constructor(
    gpioConfig: GpioConfig,
  ) {
    super(gpioConfig);
  }

}
