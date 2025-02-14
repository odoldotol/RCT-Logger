import { Byte19LogDatabase } from "../../database";
import { IOInterface } from "../ioInterface/ioInterface";
import { App } from "./app";
import {
  ReceiverRouter,
  Router,
  UsbStorageRouter
} from "./router";
import {
  LogController,
  LogService
} from "./log";
import { LogRepository } from "../database";

class AppFactoryStatic {

  /**
   * @todo databse 분리
   */
  public create(
    ioInterface: IOInterface,
    database: Byte19LogDatabase
  ) {
    const ogRepository = new LogRepository(database);

    const logService = new LogService(ogRepository);

    const logController = new LogController(logService);

    const receiverRouter = new ReceiverRouter(
      ioInterface.receiver,
      logController
    );

    const usbStorageRouter = new UsbStorageRouter(
      ioInterface.usbStorage,
      logController
    );

    const router = new Router(
      receiverRouter,
      usbStorageRouter,
    );

    return new App(router);
  }

}

export const AppFactory = new AppFactoryStatic();