import { readFile } from "fs/promises";
import {
  Logger,
  Runner
} from "../../common";

export class CpuTemp
  implements Runner
{
  private readonly logger = new Logger(CpuTemp.name);
  private readonly safeTempLimit = 70;

  private timer: NodeJS.Timeout | null = null;

  /**
   * 쓸모없는 놈
   */
  public run() {
    this.timer = setInterval(() => {
      this.readTemp()
      .then((temp) => {
        if (temp > this.safeTempLimit) {
          this.logger.warn(`${temp}°C`);
        } else {
          this.logger.log(`${temp}°C`);
        }
      })
      .catch((err) => {
        this.logger.error('Failed to read CPU temperature.', err);
      });
    }, 1000 * 60 * 60);
  }

  public stop() {
    if (this.timer) {
      clearInterval(this.timer);
    }
  }

  public isSafeTemp(): Promise<boolean> {
    return this.readTemp()
    .then((temp) => temp < this.safeTempLimit)
    .catch(() => true);
  }

  private readTemp(): Promise<number> {
    return readFile('/sys/class/thermal/thermal_zone0/temp', 'utf8')
    .then((data) => {
      return parseInt(data) / 1000;
    });
  }

}
