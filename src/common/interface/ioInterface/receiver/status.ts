import { EventEmitter } from "stream";

export interface ReceiverStatusInterfaceI
  extends EventEmitter<ReceiverStatusInterfaceEventMap>
{
  isOn(): boolean;
}

export type ReceiverStatusInterfaceEventMap = {
  [K in ReceiverStatusInterfaceEvent]: []
};

export const enum ReceiverStatusInterfaceEvent {
  TurnedOn = "turnedOn",
  TurnedOff = "turnedOff",
}