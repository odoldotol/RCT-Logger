import { Config } from "./config";
import { EnvKey } from "./const";

export class LoggerConfig {

  private readonly logMonit: boolean;

  constructor(
    private readonly config: Config
  ) {
    const logMonit = Number(this.config.get(EnvKey.LOG_MONIT));

    if (logMonit == 1) {
      this.logMonit = true;
    } else {
      this.logMonit = false;
    }
  }

  public isLogMonit(): boolean {
    return this.logMonit;
  }

}
