import { Router } from "./router";
import { Router as RouterI } from "src/common";

export class App
  implements RouterI
{

  constructor(
    private readonly router: Router,
  ) {}

  public listen() {
    this.router.listen();
  }

}
