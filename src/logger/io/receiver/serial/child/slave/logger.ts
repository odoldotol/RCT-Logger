import { Logger } from "../../../../../../common";
import { Signal } from "../const";
import { ipc } from "./ipc";

export class SlaveLogger
  extends Logger
{
  constructor(
    context: string,
  ) {
    super(context);

    this.name = this.name + " | Child";
  }

  override log(message: string) {
    ipc({
      signal: Signal.Log,
      log: this.write(
        message,
        "LOG",
      ),
    });
  }

  override error(
    message: string,
    error?: any,
    ...optionalParams: any[]
  ) {
    process.stderr.write(this.write(
      message,
      "ERROR",
    ));

    if (error) {
      process.stderr.write(error);
    }

    if (optionalParams) {
      optionalParams.forEach((param) => {
        process.stderr.write(param);
      });
    }
  }

  /**
   * Do Not Use!! Not Implemented.
   */
  override warn(_message: string) {
    return;
  }

}
