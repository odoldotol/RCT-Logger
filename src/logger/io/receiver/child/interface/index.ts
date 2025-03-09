import { Serializable } from "child_process";
import { Signal } from "../const";

export interface IPCMessage {
  signal: Signal;
  log?: string;
  data?: Serializable;
}
