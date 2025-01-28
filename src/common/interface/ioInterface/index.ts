import { ClientInterfaceI } from "./client";
import { LEDInterfacesI } from "./led";
import { ReceiverInterfaceI } from "./receiver";

export interface IOInterfaceI {
  receiver: ReceiverInterfaceI;
  client: ClientInterfaceI;
  LED: LEDInterfacesI;
}

export * from "./led";
export * from "./receiver";
export * from "./client";