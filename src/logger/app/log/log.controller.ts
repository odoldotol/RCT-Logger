import { WriteStream } from "fs";
import { B103ExtractedData } from "../../../common";
import { LogService } from "./log.service";
import { LogExcelService } from "./excel.service";


export class LogController {

  constructor(
    private readonly logService: LogService,
    private readonly logExcelService: LogExcelService
  ) {}

  /**
   * DB 가 분리 되면 비동기로 전환됨
   */
  public log(dataBuffer: B103ExtractedData) {
    this.logService.log(dataBuffer);
  }

  /**
   * Not implemented about rangeQuery
   */
  public async download(
    writeStream: WriteStream,
    // ranges: string[] // rangeQuery 를 파싱(줄바꿈으로 스플릿하고 각 요소는 10자리숫자, 10자리숫자-10자리숫자, 2자리숫자 이어야함)
    _rangeQuery: string
  ): Promise<void> {
    const rangeArr: string[] = []; // temp

    const segmentArr = await this.logService.getSegmentsByRanges(rangeArr);

    return this.logExcelService.write(
      writeStream,
      segmentArr
    );
  }

}
