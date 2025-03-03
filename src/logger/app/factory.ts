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
import { LogExcelService } from "./log/excel.service";
import { Heartbeat } from "./heartbeat";
import {
  HeartbeatName,
  LedGpioName
} from "../../config";

class AppFactoryStatic {

  /**
   * @todo databse 분리
   */
  public create(
    ioInterface: IOInterface,
    database: Byte19LogDatabase
  ) {
    const logFactory = new LogFactory();
    const logRepository = new LogRepository(database);

    const logExcelService = new LogExcelService(logFactory);
    const logService = new LogService(
      Config.loggerConfig,
      logFactory,
      logRepository,
      logExcelService,
    );

    const logController = new LogController(
      logService,
      logExcelService,
    );

    const receiverRouter = new ReceiverRouter(
      ioInterface.receiver,
      logController
    );

    const cpuTemp = new CpuTemp();
    const usbStorageRouter = new UsbStorageRouter(
      ioInterface.usbStorage,
      logController,
      cpuTemp,
    );

    const router = new Router(
      receiverRouter,
      usbStorageRouter,
    );

    const heartbeat = new Heartbeat(
      Config.heartbeatConfigService.getHeartbeat(HeartbeatName.APP),
      ioInterface.ledContainer.get(LedGpioName.Blue),
    );

    return new App(
      router,
      cpuTemp,
      heartbeat,
    );
  }

}

export const AppFactory = new AppFactoryStatic();