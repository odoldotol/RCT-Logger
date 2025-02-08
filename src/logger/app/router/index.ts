import { Router as RouterI } from 'src/common';
import { ReceiverRouter } from './receiver.router';

export * from './receiver.router';
// export * from './usb.router';

export class Router
  implements RouterI
{
  constructor(
    private readonly receiver: ReceiverRouter,
    // private readonly usbRouter: USBRouter,
  ) {}

  public listen(): void {
    this.receiver.listen();
  }

}
