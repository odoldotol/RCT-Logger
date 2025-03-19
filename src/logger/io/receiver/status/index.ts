import { EventEmitter } from "stream";
import {
  ErrorEventMap,
  IO,
  Level,
  Logger
} from "../../../../common";
import { Ar20 } from "./ar20";

/**
 * 상태를 보수적으로 판단한다. (Off 는 즉시 처리하고 On 은 일정 시간동안 기다리며 확실하면 처리한다.)  
 * 
 * HIGH 인 상태로 1s 이상 지나면 ON 상태로 봄.  
 * 그 1s 사이에 Falling edge 를 한번이라도 감지하면 Off, 다시 1s 기다림.  
 * 자세한 내용은 dev 파일 참고  
 * 
 * Off 스타트.  
 * 
 * ### 프로세스를 나누면서 pigpio 를 사용할 수 없어졌음.
 * 
 * onoff 에서도 마찬가지로 무수한 연속적인 하강엣지 검출됨  
 * 디바운스로 정확도는 잃지 않으면서 그 양을 어느정도 줄이면 좋음  
 * 10ms 가 적당하다는 결론임.  
 * 그 이상은 오프상태에서 하강엣지를 감지 못할 수 있음.
 * 
 * onWaitingTime 기존 1000 에서 머신주소 다를때 부정확함 보임  
 * 1500 으로 늘림.
 * 
 */
export class ReceiverStatus
  extends EventEmitter<ReceiverStatusEventMap | ErrorEventMap>
  implements IO
{
  private readonly logger = new Logger(ReceiverStatus.name);
  private readonly timeForWaitingStatusOn = 1500;

  private status: Status | null = null;
  private statusOnTimer: NodeJS.Timeout | null = null;

  constructor(
    private readonly ar20: Ar20,
  ) {
    super();

    this.on("error", (err) => {
      this.logger.error('Emitted Event: "error"', err);
    });
  }

  /**
   * 상승엣지 또는 하강엣지가 연속해서 나타나는 경우도 커버한다.
   * 
   * @test 송신기와 수신기 모두 정상일떄 | 송신기 꺼져있을때 | 송신기주소 다를떄 3 가지 상태에서 open 을 할 수 있는지
   */
  public open() {
    if (this.ar20.isOpen() == true) {
      return false;
    }

    this.ar20.open();

    this.ar20.watch((err, level) => {
      if (err) {
        console.error(err);
        return;
      }

      if (
        level == Level.High && // Rising edge
        // 일반적으로 Falling edge 이후에 왔다면 아래 조건은 의미없음.
        this.statusOnTimer == null
      ) {
        this.waitForOn();
      } else if (
        level == Level.Low && // Falling edge
        // 일반적으로 Rising edge 이후에 왔다면 아래 조건은 의미없음. 하지만 예외가 관찰됨.
        this.statusOnTimer != null
      ) {
        this.fallHandler();
      }
    });

    if (this.ar20.readSync() == Level.High) {
      this.waitForOn(StatusEventCode.Init);
    } else {
      this.turnOff(StatusEventCode.Init);
    }

    this.ar20.setEdge("both");

    return true;
  }

  public close() {
    if (this.ar20.isOpen() == false) {
      return false;
    }

    this.ar20.close();

    this.fallHandler(StatusEventCode.Close);

    return true;
  }

  public isOn(): boolean {
    return this.status == Status.ON;
  }

  private waitForOn(code: StatusEventCode = StatusEventCode.Work) {
    this.statusOnTimer = setTimeout(
      this.turnOn.bind(this, code),
      this.timeForWaitingStatusOn
    );
  }

  private turnOn(code: StatusEventCode) {
    this.status = Status.ON;
    this.logStatus(code);
    this.emit(Status.ON, code);
  }

  private fallHandler(code: StatusEventCode = StatusEventCode.Work) {
    if (this.statusOnTimer != null) {
      clearTimeout(this.statusOnTimer);
      this.statusOnTimer = null;
    }

    if (this.status != Status.OFF) {
      this.turnOff(code);
    }
  }

  private turnOff(code: StatusEventCode) {
    this.status = Status.OFF;
    this.logStatus(code);
    this.emit(Status.OFF, code);
  }

  private logStatus(code: StatusEventCode) {
    if (this.status == null) {
      return;
    }

    if (code == StatusEventCode.Work) {
      this.logger.log(`Turned ${Status[this.status]}.`);
    } else {
      this.logger.log(`${Status[this.status]} with ${StatusEventCode[code]}.`);
    }
  }

}

export enum Status {
  OFF,
  ON,
}

type ReceiverStatusEventMap = {
  [K in Status]: [StatusEventCode];
};

export enum StatusEventCode {
  Work,
  Init,
  Close,
}
