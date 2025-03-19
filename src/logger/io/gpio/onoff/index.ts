import {
  Gpio as Onoff,
} from 'onoff';
import {
  Direction,
  IO
} from '../../../../common';
import { GpioConfig } from '../../../../config';

export abstract class GpioOnoff
  extends Onoff
  implements IO
{
  private _isOpen = false;

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

  public open() {
    this._isOpen = true;

    return true;
  }

  public close() {
    if (this.isOpen() == false) {
      return false;
    }

    this.unwatchAll();
    this.setEdge('none');
    this.unexport();

    this._isOpen = false;

    return true;
  }

  public isOpen(): boolean {
    return this._isOpen;
  }

}
