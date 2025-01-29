import { Subject } from "rxjs";
import {
  Cycle,
} from "src/common";

export class ReceiverSerialInterface
  extends Subject<Cycle>
{}
