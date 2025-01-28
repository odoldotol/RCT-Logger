import {
  AppI,
  DatabaseI,
  IOI
} from "src/common";
import { RPServer } from "./rpServer";

class RPServerFactoryStatic
{
  public create(
    io: IOI,
    app: AppI,
    database: DatabaseI
  ): RPServer {
    
    this.initialize();
    
    const instance = new RPServer();

    return instance;
  }

  private initialize() {}

}

export const RPServerFactory = new RPServerFactoryStatic();