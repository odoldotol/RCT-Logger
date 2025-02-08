import { Gpio as Pigpio } from 'pigpio';
import {
  Direction,
  IO,
  PullUpDown
} from 'src/common';
import {
  GpioConfig,
} from 'src/config';

export abstract class GpioPigpio
  extends Pigpio
  implements IO
{
  constructor(
    protected readonly config: GpioConfig,
  ) {
    super(config.pin, {
      mode: config.direction === Direction.In ? Pigpio.INPUT : Pigpio.OUTPUT,
      pullUpDown: config.pullUpDown === PullUpDown.Up ? Pigpio.PUD_UP : Pigpio.PUD_DOWN,
    });

    if (config.debounceTimeout) {
      this.glitchFilter(config.debounceTimeout);
    }
  }

  public open() {}

  public close() {
    this.removeAllListeners();
  }

}
