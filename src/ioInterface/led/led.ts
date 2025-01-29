import { Subject } from "rxjs";
import {
  LEDData,
  LEDInterfaceI
} from "src/common";

export class LEDInterface
  extends Subject<LEDData>
  implements LEDInterfaceI
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
