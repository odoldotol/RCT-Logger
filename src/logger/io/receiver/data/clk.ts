import { GpioOnoff } from "../../gpio";
import {
  GpioConfigService,
  ReceiverGpioName
} from "../../../../config";


export class ReceiverSerialClk
  extends GpioOnoff
{
  constructor(
    gpioConfigService: GpioConfigService,
    private readonly log: (log: string) => void,
  ) {
    super(gpioConfigService.getReceiverGpioConfig(ReceiverGpioName.SERIAL_CLK));

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
