import { GpioConfig } from "../../../../config";
import { GpioPigpio } from "../../../../logger/io/gpio";

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
