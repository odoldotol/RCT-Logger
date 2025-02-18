import { IO as IOI } from "../../common";
import { LedContainer } from "./led";
import { Receiver } from "./receiver";
import { Usb } from "./usb";

export class IO
  implements IOI
{
  constructor(
    private readonly receiver: Receiver,
    private readonly usb: Usb,
    private readonly ledContainer: LedContainer,
  ) {}

  public async open(): Promise<void> {
    this.ledContainer.open();
    await this.receiver.open();
    this.usb.open();
  }

  public close() {
    this.usb.close();
    this.receiver.close();
    this.ledContainer.close();
  }

}
