import { IO as IOI } from "../../common";
import { Receiver } from "./receiver";

export class IO
  implements IOI
{
  constructor(
    private readonly receiver: Receiver,
  ) {}

  public async open(): Promise<void> {
    await this.receiver.open();
  }

  public close() {
    this.receiver.close();
  }

}
