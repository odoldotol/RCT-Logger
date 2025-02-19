import { readFile } from "fs";
import {
  Logger,
  Runner
} from "../../common";

export class CpuTemp
  implements Runner
{
  private readonly logger = new Logger(CpuTemp.name);

  private timer: NodeJS.Timeout | null = null;

  public run() {
    this.timer = setInterval(() => {
      readFile(
        '/sys/class/thermal/thermal_zone0/temp',
        'utf8', (
          err,
          data
        ) => {
          if (err) {
            this.logger.error('Failed to read CPU temperature.', err);
            return;
          }

          const tempC = parseInt(data) / 1000;
          this.logger.log(`${tempC.toFixed(2)}°C`);
        }
      );
    }, 1000 * 60 * 30);
  }

  public stop() {
    if (this.timer) {
      clearInterval(this.timer);
    }
  }

}
