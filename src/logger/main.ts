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

  database.runBatch();
  app.listen();
  app.run();
  await io.open();

  process
  .on('SIGTERM', async (signal) => {
    logger.log(`Received signal: ${signal}`);
    await terminate();
  })
  .on('SIGINT', async (signal) => {
    logger.log(`Received signal: ${signal}`);
    await terminate();
  })
  .on('uncaughtException', async (err) => {
    console.error('Uncaught Exception:', err);
    await terminate();
  })
  .on('uncaughtExceptionMonitor', async (err, origin) => {
    console.error('Uncaught Exception Monitor:', err, origin);
    await terminate();
  })
  .on('unhandledRejection', async (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
    await terminate();
  });

  /*
  fakeDownload 중에 강제로 USB 제거시 발생하는 아래의 쓰기에러를 임시로 처리하기 위해 추가

  Unhandled Rejection at: Promise {
    <rejected> [Error: EIO: i/o error, write] {
      errno: -5,
      code: 'EIO',
      syscall: 'write'
    }
  } reason: [Error: EIO: i/o error, write] {
    errno: -5,
    code: 'EIO',
    syscall: 'write'
  }

  download 구현 완성 후에 위 에러를 catch 하여 ERROR 이벤트를 emit 하여 IO Usb 에서 안전하게 처리할 수 있도록 할 것
  */


  const terminate = async () => {
    io.close();
    app.stop();
    await database.stopBatch();

    process.exit();
  };
}

bootstrap();