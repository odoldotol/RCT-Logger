import { ReceiverSerialInterfaceI } from "./serial";
import { ReceiverStatusInterfaceI } from "./status";

export interface ReceiverInterfaceI {
  status: ReceiverStatusInterfaceI;
  serial: ReceiverSerialInterfaceI;
}

export * from "./status";