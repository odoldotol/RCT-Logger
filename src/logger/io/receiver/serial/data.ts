import { Logger } from "../../../../common";
import {
  GpioConfigService,
  ReceiverGpioName
} from "../../../../config";
import { GpioPigpio } from "../../../../logger/io/gpio";

/**
 * @todo logger 주입받지 말기
 */
export class ReceiverSerialData
  extends GpioPigpio
{
  constructor(
    gpioConfigService: GpioConfigService,
    private readonly logger: Logger,
  ) {
    super(gpioConfigService.getReceiverGpioConfig(ReceiverGpioName.SERIAL));

    this.logger.log(`GPIO${this.config.pin} Initialized.`);
  }

}
