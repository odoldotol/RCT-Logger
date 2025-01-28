import {
  ClientInterfaceI,
  IOInterfaceI,
  LEDInterfacesI,
  ReceiverInterfaceI
} from "src/common";

export class IOInterface
  implements IOInterfaceI
{
  constructor(
    public readonly receiver: ReceiverInterfaceI,
    public readonly client: ClientInterfaceI,
    public readonly LED: LEDInterfacesI
  ) {}
}
