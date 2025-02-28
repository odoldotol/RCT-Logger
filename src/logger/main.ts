import { IOInterfaceFactory } from "./ioInterface";
import { IOFactory } from "./io";
import { AppFactory } from "./app";
import { Byte19LogDatabase } from "../database";
import { Config } from "../config/init";
import { LedGpioName } from "../config";
import { Logger } from "../common";

async function bootstrap() {

  const logger = new Logger('Logger');

  const ioInterface = IOInterfaceFactory.create();
  
  const database = new Byte19LogDatabase(
    Config.databaseConfig,
    ioInterface.ledContainer.get(LedGpioName.DatabaseAppend)
  );

  const io = IOFactory.create(ioInterface);
  const app = AppFactory.create(
    ioInterface,
    database
  );

  listenSignal();
  listenUncaught();

  database.run();
  app.listen();
  await io.open();
  
  logger.log('Logger is working...');

  app.run();

  function listenSignal() {
    process
    .on('SIGTERM', (signal) => {
      logger.log(`Received signal: ${signal}`);
      terminate(0);
    })
    .on('SIGINT', (signal) => {
      logger.log(`Received signal: ${signal}`);
      terminate(0);
    });
  }

  function listenUncaught() {
    process
    .on('uncaughtException', (err) => {
      console.error('Uncaught Exception:', err);
      terminate(1);
    })
    .on('uncaughtExceptionMonitor', (err, origin) => {
      console.error('Uncaught Exception Monitor:', err, origin);
      terminate(1);
    })
    .on('unhandledRejection', (reason, promise) => {
      console.error('Unhandled Rejection at:', promise, 'reason:', reason);
      terminate(1);
    });
  }

  function terminate(code: number) {
    app.stop();
    io.close();
    database.stop();

    process.exit(code);
  }

}

bootstrap();