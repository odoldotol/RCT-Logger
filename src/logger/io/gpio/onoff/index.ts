import {
  Gpio as Onoff,
} from 'onoff';
import { Direction } from '../../../../common';
import { GpioConfig } from '../../../../config';

export abstract class GpioOnoff
  extends Onoff
{
  constructor(
    protected readonly config: GpioConfig,
  ) {
    const debounceTimeout = config.debounceTimeout ? config.debounceTimeout / 1000 : undefined;

    super(
      config.pin + 512,
      config.direction === Direction.In ? 'in' : 'out',
      'none',
      debounceTimeout ? {
        debounceTimeout,
        // activeLow: false,
        // reconfigureDirection: true,
      } : {
        // activeLow: false,
        // reconfigureDirection: true,
      }
    );
  }

  public open() {}

  public close() {
    this.setEdge('none');
    this.unwatchAll();
    this.unexport();
  }

}
