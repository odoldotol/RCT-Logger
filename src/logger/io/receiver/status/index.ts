import {
  GpioConfigService,
  ReceiverGpioName
} from "../../../../config";
import { GpioOnoff } from "../../gpio";
import {
  Level,
  Logger
} from "../../../../common";
import * as X from "rxjs";

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
  extends GpioOnoff
{
  private readonly logger = new Logger(ReceiverStatus.name);

  private status: Status | null = null;

  private turnedOnHandler: Handler = X.noop;
  private turnedOffHandler: Handler = X.noop;

  private onWaitingTime = 1500;
  private rejectWaitForOn: (() => void) | null = null;
  private onTimer: NodeJS.Timeout | null = null;

  constructor(
    gpioConfigService: GpioConfigService,
  ) {
    super(gpioConfigService.getReceiverGpioConfig(ReceiverGpioName.AR20));

    this.logger.log(`GPIO${this.config.pin} Initialized.`);
  }

  /**
   * 상승엣지 또는 하강엣지가 연속해서 나타나는 경우도 커버한다.
   * 
   * @test 송신기와 수신기 모두 정상일떄 | 송신기 꺼져있을때 | 송신기주소 다를떄 3 가지 상태에서 open 을 할 수 있는지
   */
  public override open() {

    if (this.isOpen()) {
      return;
    }

    super.open();

    this.watch((err, level) => {
      if (err) {
        console.error(err);
        return;
      }

      if (
        level == Level.High && // Rising edge
        // 일반적으로 Falling edge 이후에 왔다면 아래 조건은 의미없음.
        this.onTimer == null
      ) {
        this.waitForOn();
      } else if (
        level == Level.Low && // Falling edge
        // 일반적으로 Rising edge 이후에 왔다면 아래 조건은 의미없음.
        this.onTimer != null
      ) {
        this.turnOff();
      }
    });

    if (this.readSync() == Level.High) {
      this.waitForOn();
    } else {
      this.turnOff();
    }

    this.setEdge("both");
  }

  /**
   * Disables aterts for the GPIO, Removes all listeners.
   * turn off
   */
  public override close() {

    if (this.isOpen() == false) {
      return;
    }

    super.close();

    this.turnOff();
  }

  public setHandler(
    turnedOnHandler: Handler,
    turnedOffHandler: Handler
  ) {
    this.turnedOnHandler = turnedOnHandler;
    this.turnedOffHandler = turnedOffHandler;
  }

  public isOn(): boolean {
    return this.status == Status.On;
  }

  /**
   * 1s 간 무탈하다면,
   * turn on this.status & call turnedOnHandler
   */
  private waitForOn() {
    new Promise<void>((resolve, reject) => {
      this.rejectWaitForOn = reject;
      this.onTimer = setTimeout(() => {
        resolve();
      }, this.onWaitingTime);
    }).then(() => {
      this.turnedOnHandler(this.status == null ? HandlerArg.Init : HandlerArg.OnRun);
      this.status = Status.On;
    }).catch(X.noop);
  }

  /**
   * rejectWaitForOn, clear onTimer
   * turn off this.status
   * call turnedOffHandler
   */
  private turnOff() {
    this.rejectWaitForOn && this.rejectWaitForOn();
    this.onTimer && (clearTimeout(this.onTimer), this.onTimer = null);

    if (this.status != Status.Off) {
      this.turnedOffHandler(this.status == null ? HandlerArg.Init : HandlerArg.OnRun);
      this.status = Status.Off;
    }
  }

}

const enum Status {
  Off,
  On,
}

export const enum HandlerArg {
  Init,
  OnRun,
}

type Handler = (arg: HandlerArg) => void;