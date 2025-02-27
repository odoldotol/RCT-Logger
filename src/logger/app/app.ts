import { Router } from "./router";
import {
  Logger,
  Router as RouterI,
  Runner
} from "../../common";
import { CpuTemp } from "./cpuTemp";

export class App
  implements RouterI, Runner
{
  private readonly logger = new Logger(App.name);

  constructor(
    private readonly router: Router,
    private readonly cpuTemp: CpuTemp,
  ) {
    this.logger.log('Initialized.');
  }

  public listen() {
    this.router.listen();

    this.logger.log('Listening.');
  }

  public run() {
    this.cpuTemp.run();
  }

  public stop() {
    this.cpuTemp.stop();
  }

}
