import { IOInterfaceFactory } from "./ioInterface";
import { IOFactory } from "./io";
import { AppFactory } from "./app";
import { DatabaseFactory } from "./database";
import { RPServerFactory } from "./rpServer";

async function bootstrap() {

  const ioInterface = IOInterfaceFactory.create();

  const io = IOFactory.create(ioInterface);
  const app = AppFactory.create(ioInterface);
  const databbase = DatabaseFactory.create();

  const rpServer = RPServerFactory.create(
    io,
    app,
    databbase
  );

  process.on('SIGINT', async () => {
    await rpServer.terminate();
    process.exit();
  });

  await rpServer.start();
}

bootstrap();