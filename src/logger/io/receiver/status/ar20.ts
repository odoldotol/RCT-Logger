import {
  GpioConfigService,
  ReceiverGpioName
} from "../../../../config";
import { GpioOnoff } from "../../gpio";
import {
  IO,
  Logger
} from "../../../../common";

export class Ar20
  extends GpioOnoff
  implements IO
{
  private readonly logger = new Logger(Ar20.name);

  constructor(
    gpioConfigService: GpioConfigService,
  ) {
    super(gpioConfigService.getReceiverGpioConfig(ReceiverGpioName.AR20));

    this.logger.log(`GPIO${this.config.pin} Initialized.`);
  }

  public override open() {
    if (this.isOpen() == true) {
      return;
    }

    super.open();

    this.setEdge("both");
  }

}
