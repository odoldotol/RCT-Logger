import { Logger } from "../../common";
import { LEDInterfaceContainer } from "./led";
import { ReceiverInterface } from "./receiver";
import { UsbStorageInterface } from "./usb";

export class IOInterface {

  private readonly logger = new Logger(IOInterface.name);

  constructor(
    public readonly receiver: ReceiverInterface,
    public readonly usbStorage: UsbStorageInterface,
    public readonly ledContainer: LEDInterfaceContainer,
  ) {
    this.logger.log('Initialized.');
  }

}
