import { IOInterfaceFactory } from "./ioInterface";
import { IOFactory } from "./io";
import { AppFactory } from "./app";
import { Byte19LogDatabase } from "../database";
import { Config } from "../config/init";

async function bootstrap() {

  const database = new Byte19LogDatabase(Config.databaseConfig);

  const ioInterface = IOInterfaceFactory.create();

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
  });

  const terminate = () => {
    io.close();
    process.exit();
  };
}

bootstrap();