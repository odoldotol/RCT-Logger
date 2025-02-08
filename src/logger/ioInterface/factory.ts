import { IOInterface } from "./ioInterface";
import { ReceiverInterface } from "./receiver";

class IOInterfaceFactoryStatic
{ 
  public create(): IOInterface {
    const receiver = new ReceiverInterface();
    return new IOInterface(receiver);
  }

}

export const IOInterfaceFactory = new IOInterfaceFactoryStatic();