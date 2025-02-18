import { IOInterfaceFactory } from "./ioInterface";
import { IOFactory } from "./io";
import { AppFactory } from "./app";
import { Byte19LogDatabase } from "../database";
import { Config } from "../config/init";
import { LedGpioName } from "../config";

async function bootstrap() {

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

  database.runBatch();
  app.listen();
  io.open();

  process
  .on('SIGTERM', () => {
    terminate();
  })
  .on('SIGINT', () => {
    terminate();
  })
  .on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  });

  const terminate = () => {
    io.close();
    process.exit();
  };
}

bootstrap();