import { Subject } from "rxjs";
import { Cycle } from "../../serial";

export interface ReceiverSerialInterfaceI
  extends Subject<Cycle> {}