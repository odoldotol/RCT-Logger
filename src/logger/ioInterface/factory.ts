import { IOInterface } from "./ioInterface";
import { ReceiverInterface } from "./receiver";
import { UsbStorageInterface } from "./usb";

class IOInterfaceFactoryStatic
{ 
  public create(): IOInterface {
    const receiver = new ReceiverInterface();
    const usbStorage = new UsbStorageInterface();

    return new IOInterface(
      receiver,
      usbStorage,
    );
  }

}

export const IOInterfaceFactory = new IOInterfaceFactoryStatic();