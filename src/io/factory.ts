import { IOInterface } from "src/ioInterface/ioInterface";
import { IO } from "./io";

export class IOFactory {
  static create(ioInterface: IOInterface) {
    return new IO();
  }
}
