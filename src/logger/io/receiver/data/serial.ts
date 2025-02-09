import { GpioName } from "../../../../common";
import { GpioConfigService } from "../../../../config";
import { GpioPigpio } from "../../../../logger/io/gpio";

export class ReceiverSerial
  extends GpioPigpio
{
  constructor(
    gpioConfigService: GpioConfigService,
    private readonly log: (log: string) => void,
  ) {
    super(gpioConfigService.getGpio(GpioName.RECEIVER_SERIAL));

    this.log(`Serial GPIO${this.config.pin} is initialized.`);
  }

}
