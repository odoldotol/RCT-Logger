import { Gpio as Pigpio } from 'pigpio';
import {
  Direction,
  GpioName,
  PullUpDown
} from 'src/common';
import {
  Gpio as GpioInfo,
  GpioConfig,
} from 'src/config';

export class Gpio
  extends Pigpio
{
  protected readonly gpio: GpioInfo;

  constructor(
    protected readonly gpioConfig: GpioConfig,
    name: GpioName
  ) {
    const gpio = gpioConfig.getGpio(name);

    super(gpio.pin, {
      mode: gpio.direction === Direction.In ? Pigpio.INPUT : Pigpio.OUTPUT,
      pullUpDown: gpio.pullUpDown === PullUpDown.Up ? Pigpio.PUD_UP : Pigpio.PUD_DOWN,
    });

    if (gpio.debounceTimeout) {
      this.glitchFilter(gpio.debounceTimeout);
    }

    this.gpio = gpio;
  }

}
