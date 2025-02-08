import { GpioConfig } from "src/config";
import { GpioPigpio } from "../../gpio";
import {
  Level
} from "src/common";
import * as X from "rxjs";

/**
 * HIGH 인 상태로 1s 이상 지나면 ON 상태로 봄.
 * 그 1s 사이에 Falling edge 를 한번이라도 감지하면 Off, 다시 1s 기다림.
 * 자세한 내용은 dev 파일 참고
 * 
 * Off 스타트.
 */
export class ReceiverStatus
  extends GpioPigpio
{
  private isOpen = false;

  private status: Status | null = null;

  private turnedOnHandler: Handler = X.noop;
  private turnedOffHandler: Handler = X.noop;

  private rejectWaitForOn: (() => void) | null = null;
  private onTimer: NodeJS.Timeout | null = null;

  /**
   * @param gpioConfig AR20
   */
  constructor(
    gpioConfig: GpioConfig,
  ) {
    super(gpioConfig);
  }

  /**
   * 상승엣지 또는 하강엣지가 연속해서 나타나는 경우도 커버한다.
   * 
   * @test 송신기와 수신기 모두 정상일떄 | 송신기 꺼져있을때 | 송신기주소 다를떄 3 가지 상태에서 open 을 할 수 있는지
   */
  public override open() {

    if (this.isOpen) {
      return;
    }

    super.open();

    this.on('alert', level => {
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

    if (this.digitalRead() === Level.High) {
      this.waitForOn();
    } else {
      this.turnOff();
    }

    this.enableAlert();

    this.isOpen = true;
  }

  /**
   * Disables aterts for the GPIO, Removes all listeners.
   * turn off
   */
  public override close() {

    if (this.isOpen == false) {
      return;
    }

    super.close();

    this.disableAlert();

    this.turnOff();

    this.isOpen = false;
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
      }, 1000);
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