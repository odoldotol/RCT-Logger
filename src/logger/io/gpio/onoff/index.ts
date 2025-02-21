import {
  Gpio as Onoff,
} from 'onoff';
import { Direction } from '../../../../common';
import { GpioConfig } from '../../../../config';

export abstract class GpioOnoff
  extends Onoff
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
    if (this._isOpen == true) {
      return;
    }

    this._isOpen = true;
  }

  public close() {
    if (this._isOpen == false) {
      return;
    }

    this.unwatchAll();
    this.setEdge('none');
    this.unexport();

    this._isOpen = false;
  }

  protected isOpen(): boolean {
    return this._isOpen;
  }

}
