import { GpioConfig } from "src/config";
import { Gpio } from "../../gpio";
import {
  ReceiverStatusInterface,
  ReceiverStatusInterfaceEvent
} from "src/ioInterface";
import {
  GpioName,
  IO,
  Level
} from "src/common";
import * as X from "rxjs";

/**
 * HIGH 인 상태로 1s 이상 지나면 ON 상태로 봄.
 * 그 1s 사이에 Falling edge 를 한번이라도 감지하면 다시 1s 기다림.
 * 자세한 내용은 dev 파일 참고
 */
export class Status
  extends Gpio
  implements IO
{
  private isOpen = false;
  private rejectWaitForOn: (() => void) | null = null;
  private onTimer: NodeJS.Timeout | null = null;

  constructor(
    gpioConfig: GpioConfig,
    private readonly statusInterface: ReceiverStatusInterface
  ) {
    super(
      gpioConfig,
      GpioName.RECEIVER_AR20
    );
  }

  /**
   * 상승엣지 또는 하강엣지가 연속해서 나타나는 경우도 커버한다.
   * 
   * @test 송신기와 수신기 모두 정상일떄 | 송신기 꺼져있을때 | 송신기주소 다를떄 3 가지 상태에서 open 을 할 수 있는지
   */
  public open() {

    if (this.isOpen) {
      return;
    }

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
    }

    this.enableAlert();

    this.isOpen = true;
  }

  /**
   * Disables aterts for the GPIO, Removes all listeners.
   */
  public close() {

    if (this.isOpen == false) {
      return;
    }

    this.disableAlert();
    this.removeAllListeners();

    this.turnOff();

    this.isOpen = false;
  }

  /**
   * 1초 뒤 on 상태 만들기
   */
  private waitForOn() {
    new Promise<void>((resolve, reject) => {
      this.rejectWaitForOn = reject;
      this.onTimer = setTimeout(() => {
        resolve();
      }, 1000);
    }).then(() => {
      this.statusInterface.emit(ReceiverStatusInterfaceEvent.TurnedOn);
    }).catch(X.noop);
  }

  /**
   * rejectWaitForOn, clear onTimer, emit TurnedOff
   */
  private turnOff() {
    this.rejectWaitForOn && this.rejectWaitForOn();
    this.onTimer && (clearTimeout(this.onTimer), this.onTimer = null);

    this.statusInterface.isOn() && this.statusInterface.emit(ReceiverStatusInterfaceEvent.TurnedOff);
  }

}
