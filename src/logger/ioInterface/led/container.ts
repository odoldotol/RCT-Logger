import { LedGpioName } from "../../../config";
import { LedInterface } from "./led";

/**
 * 생성한 이후 추가/변경이 없는 컨테이너
 */
export class LEDInterfaceContainer {

  constructor(
    private readonly container: Map<LedGpioName, LedInterface>,
  ) {}

  public get(ledName: LedGpioName): LedInterface {
    return this.container.get(ledName)!;
  }

}
