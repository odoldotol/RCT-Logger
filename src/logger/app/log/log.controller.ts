import { B103ExtractedData } from "src/common";
import { LogService } from "./log.service";


export class LogController {

  constructor(
    private readonly logService: LogService
  ) {}

  public log(dataBuffer: B103ExtractedData) {
    this.logService.log(dataBuffer);
  }

  public download() {}

}
