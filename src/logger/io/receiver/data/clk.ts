import { GpioOnoff } from "../../gpio";
import { GpioConfigService } from "../../../../config";
import { GpioName } from "../../../../common";


export class ReceiverSerialClk
  extends GpioOnoff
{
  constructor(
    gpioConfigService: GpioConfigService,
    private readonly log: (log: string) => void,
  ) {
    super(gpioConfigService.getGpio(GpioName.RECEIVER_SERIAL_CLK));

    this.log(`SerialClk GPIO${this.config.pin} is initialized.`);
  }

  public run() {
    if (this.edge() != "rising") {
      this.setEdge("rising");
    }
  }

  public stop() {
    if (this.edge() != "none") {
      this.setEdge("none");
    }
  }

}
