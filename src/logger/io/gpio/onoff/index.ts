import { Gpio as Onoff } from 'onoff';
import { Direction } from '../../../../common';
import { GpioConfig } from '../../../../config';

export abstract class GpioOnoff
  extends Onoff
{
  constructor(
    protected readonly config: GpioConfig,
  ) {
    super(
      config.pin + 512,
      config.direction === Direction.In ? 'in' : 'out'
    );
  }

  public open() {}

  public close() {
    this.unwatchAll();
    this.unexport();
  }

}
