import {
  ReceiverStatusInterfaceEvent,
  ReceiverStatusInterfaceEventMap,
  ReceiverStatusInterfaceI
} from "src/common";
import { EventEmitter } from "stream";

/**
 * 초기화때 상태는 false.
 * 포트가 열리고 상태확인이 되면 이벤트를 emit 해줘서 상태를 동기화해주자.
 */
export class ReceiverStatusInterface
  extends EventEmitter<ReceiverStatusInterfaceEventMap>
  implements ReceiverStatusInterfaceI
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

