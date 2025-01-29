import { Subject } from "rxjs";
import {
  Cycle,
  ReceiverSerialInterfaceI
} from "src/common";

export class ReceiverSerialInterface
  extends Subject<Cycle>
  implements ReceiverSerialInterfaceI
{}
