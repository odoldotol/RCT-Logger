import { EventEmitter } from "stream";

/**
 * Off 스타트.
 */
export class ReceiverStatusInterface
  extends EventEmitter<ReceiverStatusInterfaceEventMap>
{
  private status = false;

  constructor() {
    super();

    this.on(ReceiverStatusInterfaceEvent.TurnedOn, () => {
      this.status = true;
    });

    this.on(ReceiverStatusInterfaceEvent.TurnedOff, () => {
      this.status = false;
    });
  }

  public isOn(): boolean {
    return this.status;
  }

}

export type ReceiverStatusInterfaceEventMap = {
  [K in ReceiverStatusInterfaceEvent]: []
};

export const enum ReceiverStatusInterfaceEvent {
  TurnedOff,
  TurnedOn,
}
