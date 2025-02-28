import { Serializable } from "node:child_process";
import { ReceiverData } from "../data";

/**
 * @todo ipc, std 스태틱 매서드에서 제거
 */
export class Child {

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
      signal: ChildSignal.Log,
      log
    });
  }

  constructor(
    private readonly data: ReceiverData
  ) {}

  public activate() {
    this.onSignal();
    this.onMessage();

    this.ipc({ signal: ChildSignal.Activated });
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
        case ChildSignal.Open:
          this.data.open();
          this.ipc({ signal: ChildSignal.Open });
          // this.heartbeat.run();
          break;
        case ChildSignal.Close:
          // this.heartbeat.stop();
          this.data.close();
          break;
        case ChildSignal.Run:
          this.data.run();
          break;
        case ChildSignal.Stop:
          this.data.stop();
          break;
        default:
      }
    });
  }

  private ipc(msg: IPCMessage) {
    Child.ipc(msg, (err: any) => {
      if (err) {
        process.stderr.write(`Child | IPC Error: ${err}\n`);
      }
    });
  }

}

export interface IPCMessage {
  signal: ChildSignal;
  log?: string;
  data?: Serializable;
}

export const enum ChildSignal {
  Close,
  Open,
  Stop,
  Run,
  Log,
  Activated,
}
