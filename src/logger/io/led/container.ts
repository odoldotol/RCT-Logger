import { LedGpioName } from "../../../config";
import { Led } from "./led";

/**
 * 생성한 이후 추가/변경이 없는 컨테이너
 */
export class LedContainer {

  constructor(
    private readonly container: Map<LedGpioName, Led>,
  ) {}

  public open() {
    for (const led of this.container.values()) {
      led.open();
    }
  }

  public close() {
    for (const led of this.container.values()) {
      led.close();
    }
  }

}
