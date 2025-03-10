import {
  GpioConfigService,
  ReceiverGpioName
} from "../../../../config";
import { GpioPigpio } from "../../../../logger/io/gpio";

/**
 * @todo logger 주입받지 말기
 */
export class ReceiverSerial
  extends GpioPigpio
{
  constructor(
    gpioConfigService: GpioConfigService,
    private readonly log: (log: string) => void,
  ) {
    super(gpioConfigService.getReceiverGpioConfig(ReceiverGpioName.SERIAL));

    this.log(`[Serial] GPIO${this.config.pin} Initialized.`);
  }

}
