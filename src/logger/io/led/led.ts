import {
  IO,
  Level,
  Logger
} from "../../../common";
import { GpioConfig } from "../../../config";
import { LedInterface } from "../../ioInterface/led";
import { GpioOnoff } from "../gpio";
import { Subscription } from "rxjs";

export class Led
  extends GpioOnoff
  implements IO
{
  private readonly logger = new Logger(`${Led.name}_${this.config.pin}`);

  private subscription: Subscription | null = null;

  constructor(
    gpioConfig: GpioConfig,
    private readonly ledInterface: LedInterface,
  ) {
    super(gpioConfig);
  }

  public override open(): void {
    super.open();

    // Onoff 는 reconfigureDirection == false 면 초기화때 방향을 재구성하면서 Level 도 0 으로 셋하게 됨.
    if (this.config.initialValue == Level.High) {
      try {
        this.writeSync(this.config.initialValue);
      } catch (err) {
        this.logger.error("Failed to write initialValue", err);
      }
    }

    if (this.subscription) {
      return;
    }

    this.subscription = this.ledInterface.getLevelStream()
    .subscribe(level => {
      this.write(level, err => {
        if (err) {
          this.logger.error("Failed to write", err);
        }
      });
    });
  }

  public override close(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
      this.subscription = null;
    }

    super.close();
  }

}
