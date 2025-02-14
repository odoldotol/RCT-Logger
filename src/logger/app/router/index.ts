import { Router as RouterI } from '../../..//common';
import { ReceiverRouter } from './receiver.router';
import { UsbStorageRouter } from './usbStorage.router';

export * from './receiver.router';
export * from './usbStorage.router';

export class Router
  implements RouterI
{
  constructor(
    private readonly receiver: ReceiverRouter,
    private readonly usbStorage: UsbStorageRouter,
  ) {}

  public listen(): void {
    this.receiver.listen();
    this.usbStorage.listen();
  }

}
