import { Byte19LogDatabase } from "../../database";
import { IOInterface } from "../ioInterface/ioInterface";
import { App } from "./app";
import { ReceiverRouter, Router } from "./router";
import { LogController, LogService } from "./log";
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

    const eceiverRouter = new ReceiverRouter(
      ioInterface.receiver,
      logController
    );

    const router = new Router(eceiverRouter);

    return new App(router);
  }

}

export const AppFactory = new AppFactoryStatic();