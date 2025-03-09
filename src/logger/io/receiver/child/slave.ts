import { ReceiverData } from "../data";
import { Heartbeat } from "../../../app/heartbeat";
import { Signal } from "./const";
import { IPCMessage } from "./interface";

/**
 * @todo ipc, std 스태틱 매서드에서 제거
 */
export class ChildSlave {

  private static ipc = (() => {
    if (process.send == undefined) {
      throw new Error("Child process does not have IPC.");
    }

    return process.send.bind(process);
  })();

  public static readonly dataHandler = (data: Buffer) => {
    process.stdout.write(data, (err) => {
      if (err) {
        process.stderr.write(`Child | ReceiverData process.stdout.write error: ${err}\n`);
      }
    });
  };

  public static readonly errorHandler = (error: any) => {
    process.stderr.write(`Child | ReceiverData Error: ${error}\n`);
  };

  public static readonly logHandler = (log: string) => {
    this.ipc({
      signal: Signal.Log,
      log
    });
  }

  constructor(
    private readonly data: ReceiverData,
    private readonly heartbeat: Heartbeat,
  ) {}

  public activate() {
    this.onSignal();
    this.onMessage();

    this.ipc({ signal: Signal.Activated });
  }

  private onSignal() {
    process.on("SIGINT", () => {
      this.data.close();
    });
    
    process.on("SIGTERM", () => {
      this.data.close();
    });
  }

  private onMessage() {
    process.on("message", (msg: IPCMessage) => {
      switch (msg.signal) {
        case Signal.Open:
          this.data.open();
          this.ipc({ signal: Signal.Open });
          this.heartbeat.run();
          break;
        case Signal.Close:
          this.heartbeat.stop();
          this.data.close();
          break;
        case Signal.Run:
          this.data.run();
          break;
        case Signal.Stop:
          this.data.stop();
          break;
        default:
      }
    });
  }

  private ipc(msg: IPCMessage) {
    ChildSlave.ipc(msg, (err: any) => {
      if (err) {
        process.stderr.write(`Child | IPC Error: ${err}\n`);
      }
    });
  }

}
