import { B103ExtractedData } from "../../../common";
import { LogService } from "./log.service";


export class LogController {

  constructor(
    private readonly logService: LogService
  ) {}

  public log(dataBuffer: B103ExtractedData) {
    this.logService.log(dataBuffer);
  }

  // public download(writeDir: string, downloadDate: DownloadDate) {}

  public async fakeDownload(writeDir: string) {
    return this.logService.fakeDownload(writeDir);
  }

}

// type DownloadDate = string[];