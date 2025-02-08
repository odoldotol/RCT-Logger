import { GpioOnoff } from "../../gpio";
import { GpioConfig } from "../../../../config";


export class ReceiverSerialClk
  extends GpioOnoff
{
  /**
   * @param gpioConfig RECEIVER_SERIAL_CLK
   */
  constructor(
    gpioConfig: GpioConfig,
  ) {
    super(gpioConfig);
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
