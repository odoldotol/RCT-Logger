import { Serializable } from "child_process";
import { MessageSubject } from "../const";

export interface IPCMessage {
  subject: MessageSubject;
  log?: string;
  data?: Serializable;
}
