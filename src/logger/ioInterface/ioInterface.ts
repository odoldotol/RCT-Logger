import { ReceiverInterface } from "./receiver";

export class IOInterface {

  constructor(
    public readonly receiver: ReceiverInterface,
    // public readonly client: ClientInterface,
    // public readonly LED: LEDInterfaces
  ) {}

}
