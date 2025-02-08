import { ChildSignal } from "..";
import { ReceiverData } from "../data";

/**
 * @Todo 헬스체크
 */
export class Child {

  private readonly dataHandler = (data: Buffer) => {
    process.stdout.write(data, (err) => {
      if (err) {
        process.stderr.write(`Child | ReceiverData process.stdout.write error: ${err}\n`);
      }
    });
  };

  private readonly errorHandler = (error: any) => {
    process.stderr.write(`Child | ReceiverData Error: ${error}\n`);
  };

  constructor(
    private readonly data: ReceiverData
  ) {}

  public activate() {
    this.onSignal();
    this.onMessage();

    this.data.setHandler(
      this.dataHandler,
      this.errorHandler
    );
  }

  private healthCheck() {}

  private onSignal() {
    process.on("SIGINT", () => {
      this.data.close();
    });
    
    process.on("SIGTERM", () => {
      this.data.close();
    });
  }

  private onMessage() {
    process.on("message", (msg) => {
      switch (msg) {
        case ChildSignal.Open:
          this.data.open();
          break;
        case ChildSignal.Close:
          this.data.close();
          break;
        case ChildSignal.Run:
          this.data.run();
          break;
        case ChildSignal.Stop:
          this.data.stop();
          break;
        case ChildSignal.Health:
          this.healthCheck();
          break;
        default:
      }
    });
  }

}
