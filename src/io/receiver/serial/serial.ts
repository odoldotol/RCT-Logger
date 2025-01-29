import { GpioConfig } from "src/config";
import { Gpio } from "../../gpio";
import {
  GpioName,
  IO,
  Level
} from "src/common";
import {
  ReceiverSerialInterface,
  ReceiverStatusInterface
} from "src/ioInterface";
import { SyncClk } from "./clk";

/**
 */
export class Serial
  extends Gpio
  implements IO
{
  private readonly wordLength = 32;
  private syncWordCnt = 1;
  private syncronized = false;
  private cycleBufferIdx = 0;

  private readonly cycleBuffer = new Uint8Array(8192);

  constructor(
    gpioConfig: GpioConfig,
    private readonly serialInterface: ReceiverSerialInterface,
    private readonly statusInterface: ReceiverStatusInterface,
    private readonly syncClk: SyncClk,
  ) {
    super(
      gpioConfig,
      GpioName.RECEIVER_SERIAL
    );
  }

  /**
   * 직접 호출하지 마시오!!  
   * ReceiverStatusInterface 의 TurnedOn 리스너로 등록하는것으로 충분.
   */
  public open() {
    this.syncClk.on("alert", level => {
      if (level == Level.High) {
        this.a();
      }
    });

    this.syncClk.open();
  }

  /**
   * 직접 호출하지 마시오!!  
   * ReceiverStatusInterface 의 TurnedOff 리스너로 등록하는것으로 충분.
   */
  public close() {
    this.syncClk.close();
  }

  private a() {
    const level = this.digitalRead();
    const isSyncWord = this.findSyncWord(level);
    if (
      !isSyncWord &&
      this.syncronized
    ) {
      this.addBuffer(level);
    } else if (
      isSyncWord &&
      this.syncronized
    ) {
      console.log(this.cycleBuffer);
      this.cycleBufferIdx = 0;
    } else if (
      isSyncWord &&
      !this.syncronized
    ) {
      this.syncronized = true;
    }
  }

  private findSyncWord(level: Level): boolean {

    if (this.syncWordCnt == 1) {
      level == Level.High && this.syncWordCnt++;
    } else if (
      2 <= this.syncWordCnt &&
      this.syncWordCnt <= 30
    ) {
      level == Level.Low ? this.syncWordCnt++ : this.syncWordCnt = 2;
    } else if (this.syncWordCnt == 31) {
      level == Level.High ? this.syncWordCnt++ : this.syncWordCnt = 1;
    } else if (this.syncWordCnt == 32) {
      this.syncWordCnt = 1;
      return level == Level.High;
    }

    return false;
  }

  private addBuffer(level: Level) {
    this.cycleBuffer[this.cycleBufferIdx++] = level;
  }

}
