import { IOInterface } from "./ioInterface";

class IOInterfaceFactoryStatic
{ 
  public create(): IOInterface {
    return new IOInterface();
  }

}

export const IOInterfaceFactory = new IOInterfaceFactoryStatic();