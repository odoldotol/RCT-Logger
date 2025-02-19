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
  LogFactory,
  LogService
} from "./log";
import { LogRepository } from "../database";
import { CpuTemp } from "./cpuTemp";
import { Config } from "../../config/init";

class AppFactoryStatic {

  /**
   * @todo databse 분리
   */
  public create(
    ioInterface: IOInterface,
    database: Byte19LogDatabase
  ) {
    const logRepository = new LogRepository(database);
    const logFactory = new LogFactory();

    const logService = new LogService(
      Config.loggerConfig,
      logFactory,
      logRepository,
    );

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

    const cpuTemp = new CpuTemp();

    return new App(
      router,
      cpuTemp
    );
  }

}

export const AppFactory = new AppFactoryStatic();