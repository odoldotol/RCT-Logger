import {
  AsyncOpenIO,
  Logger
} from "../../common";
import { LedContainer } from "./led";
import { Receiver } from "./receiver";
import { Usb } from "./usb";

export class IO
  implements AsyncOpenIO
{
  private readonly logger = new Logger(IO.name);

  constructor(
    private readonly receiver: Receiver,
    private readonly usb: Usb,
    private readonly ledContainer: LedContainer,
  ) {
    this.logger.log('Initialized.');
  }

  public async open() {
    this.ledContainer.open();
    await this.receiver.open();
    this.usb.open();

    this.logger.log('Opened.');

    return true;
  }

  public close() {
    this.usb.close();
    this.receiver.close();
    this.ledContainer.close();

    this.logger.log('Closed.');

    return true;
  }

}
