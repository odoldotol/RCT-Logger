import { Router } from "./router";
import { Router as RouterI, Runner } from "../../common";
import { CpuTemp } from "./cpuTemp";

export class App
  implements RouterI, Runner
{

  constructor(
    private readonly router: Router,
    private readonly cpuTemp: CpuTemp,
  ) {}

  public listen() {
    this.router.listen();
  }

  public run() {
    this.cpuTemp.run();
  }

  public stop() {
    this.cpuTemp.stop();
  }

}
