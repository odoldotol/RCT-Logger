import { IO as IOI, Logger } from "../../common";
import { LedContainer } from "./led";
import { Receiver } from "./receiver";
import { Usb } from "./usb";

export class IO
  implements IOI
{
  private readonly logger = new Logger(IO.name);

  constructor(
    private readonly receiver: Receiver,
    private readonly usb: Usb,
    private readonly ledContainer: LedContainer,
  ) {}

  public async open(): Promise<void> {
    this.ledContainer.open();
    await this.receiver.open();
    this.usb.open();

    this.logger.log('Opened.');
  }

  public close() {
    this.usb.close();
    this.receiver.close();
    this.ledContainer.close();

    this.logger.log('Closed.');
  }

}
