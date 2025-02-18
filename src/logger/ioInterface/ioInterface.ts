import { LEDInterfaceContainer } from "./led";
import { ReceiverInterface } from "./receiver";
import { UsbStorageInterface } from "./usb";

export class IOInterface {

  constructor(
    public readonly receiver: ReceiverInterface,
    public readonly usbStorage: UsbStorageInterface,
    public readonly ledContainer: LEDInterfaceContainer,
  ) {}

}
