import { IOInterfaceI } from "src/common";
import { App } from "./app";

export class AppFactory {
  static create(ioInterface: IOInterfaceI) {
    return new App();
  }
}
