import {
  Logger,
  Runner
} from "../../../../common";
import { GpioOnoff } from "../../gpio";
import {
  GpioConfigService,
  ReceiverGpioName
} from "../../../../config";

/**
 * @todo logger 주입받지 말기
 */
export class ReceiverSerialClk
  extends GpioOnoff
  implements Runner
{
  constructor(
    gpioConfigService: GpioConfigService,
    private readonly logger: Logger,
  ) {
    super(gpioConfigService.getReceiverGpioConfig(ReceiverGpioName.SERIAL_CLK));

    this.logger.log(`GPIO${this.config.pin} Initialized.`);
  }

  public run() {
    if (this.isOpen() == false) {
      this.logger.log(`SerialClk Cannot run because it is not opened.`);
      return;
    }

    if (this.edge() != "rising") {
      this.setEdge("rising");
    }
  }

  /**
   * Closed 면 noop
   */
  public stop() {
    if (this.isOpen() == false) {
      return;
    }

    if (this.edge() != "none") {
      this.setEdge("none");
    }
  }

}
