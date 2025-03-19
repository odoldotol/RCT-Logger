import { HeartbeatName } from "../../../../../../config";
import { Config } from "../../../../../../config/init";
import { Heartbeat } from "../../../../../app/heartbeat";
import { ReceiverSerialFactory } from "../../factory";
import { Signal } from "../const";
import { IPCMessage } from "../interface";
import { ipc } from "./ipc";
import { SlaveLogger } from "./logger";

async function bootstrap() {
  const logger = new SlaveLogger('SerialSlave');

  const heartbeat = new Heartbeat(
    Config.heartbeatConfigService.getHeartbeat(HeartbeatName.CHILD),
    null,
    logger.error.bind(logger),
  );

  const receiverSerial = ReceiverSerialFactory.create();

  receiverSerial.on('data', (data) => {
    return process.stdout.write(data, (err) => {
      if (err) {
        logger.error(`stdout.write error: ${err}\n`);
        throw err;
      }
    });
  });

  listenSignal();
  listenUncaught();
  
  listenIpc();

  ipc({ signal: Signal.Activated });

  function listenSignal() {
    process
    .on("SIGINT", (signal) => {
      logger.log(`Received signal: ${signal}`);
      terminate(0);
    })
    .on("SIGTERM", (signal) => {
      logger.log(`Received signal: ${signal}`);
      terminate(0);
    });
  }

  function listenIpc() {
    process.on("message", (msg: IPCMessage) => {
      switch (msg.signal) {
        case Signal.Open:
          receiverSerial.open();
          ipc({ signal: Signal.Open });
          heartbeat.run();
          break;
        case Signal.Close:
          heartbeat.stop();
          receiverSerial.close();
          break;
        case Signal.Run:
          receiverSerial.run();
          break;
        case Signal.Stop:
          receiverSerial.stop();
          break;
        default:
      }
    });
  }

  function listenUncaught() {
    process
    .on('uncaughtException', (err) => {
      logger.error('Uncaught Exception:', err);
      terminate(1);
    })
    .on('uncaughtExceptionMonitor', (err, origin) => {
      logger.error('Uncaught Exception Monitor:', err, origin);
      terminate(1);
    })
    .on('unhandledRejection', (reason, promise) => {
      logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
      terminate(1);
    });
  }

  function terminate(code: number) {
    heartbeat.stop();
    receiverSerial.close();

    process.exit(code);
  }
}

bootstrap();