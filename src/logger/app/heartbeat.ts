import { writeFile } from "fs";
import {
  Logger,
  Runner
} from "../../common";
import { LedInterface } from "../ioInterface";
import { HeartbeatConfig } from "../../config";

export class Heartbeat
  implements Runner
{
  private timer: NodeJS.Timeout | null = null;

  constructor(
    private readonly config: HeartbeatConfig,
    private readonly ledInterface: LedInterface | null = null,
    private readonly error: (...args: any[]) => void = Logger.prototype.error.bind(new Logger(Heartbeat.name)),
  ) {}

  public run(): void {
    this.timer = setInterval(() => {
      writeFile(this.config.path, new Date().toLocaleString("en-GB", { timeZone: "Asia/Seoul" }), (err) => {
        if (err) {
          this.error(`Failed to write heartbeat file: ${this.config.path}`, err);
        } else {
          this.ledInterface?.blinkOnce(10);
        }
      });
    }, this.config.interval);
  }

  public stop(): void {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
  }
}
