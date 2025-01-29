import { Subject } from "rxjs";

export class LEDInterface
  extends Subject<LEDData>
{
  constructor() {
    super();
  }

  public on(): void {
    this.next(LEDData.On);
  }

  public off(): void {
    this.next(LEDData.Off);
  }

  public blinkOnce(ms = 250): void {
    this.on();
    setTimeout(() => this.off(), ms);
  }

}

export const enum LEDData {
  On = 1,
  Off = 0,
}
