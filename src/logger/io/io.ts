import { IO as IOI } from "../../common";
import { Receiver } from "./receiver";
import { Usb } from "./usb";

export class IO
  implements IOI
{
  constructor(
    private readonly receiver: Receiver,
    private readonly usb: Usb,
  ) {}

  public async open(): Promise<void> {
    await this.receiver.open();
    this.usb.open();
  }

  public close() {
    this.receiver.close();
    this.usb.close();
  }

}
