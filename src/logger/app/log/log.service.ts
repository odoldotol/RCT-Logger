import {
  B103ExtractedData,
  Logger
} from "../../../common";
import { LogRepository } from "../../../logger/database";
import { LogFactory } from "./log.factory";
import { LoggerConfig } from "../../../config/logger";
import { LogExcelService } from "./excel.service";
import { Subject } from "rxjs";
import * as X from "rxjs/operators";


export class LogService {

  private readonly logger = new Logger(LogService.name);

  private monitorSubject: Subject<B103ExtractedData> | null = null;

  constructor(
    private readonly loggerConfig: LoggerConfig,
    private readonly logFactory: LogFactory,
    private readonly logRepository: LogRepository,
    private readonly logExcelService: LogExcelService,
  ) {
    if (this.loggerConfig.isLogMonit()) {
      this.monitorSubject = new Subject<B103ExtractedData>();

      // excel 출력전 압축로직을 모방하여 초당 1회 로깅
      this.monitorSubject.pipe(
        X.bufferTime(1000),
        X.map(dataArr => dataArr.map(data => this.logFactory.create(data))),
        this.logExcelService.summarizeLogsBySecond(),
      ).subscribe(logArr => {
        logArr.forEach(log => {
          console.log(log);
        });
      });

      this.logger.log("Monitor Activated.");
    }
  }

  /**
   * DB 가 분리 되면 비동기로 전환됨
   */
  public log(dataBuffer: B103ExtractedData) {
    if (this.monitorSubject != null) {
      this.monitLog(dataBuffer);
    }

    this.logRepository.create(dataBuffer);
  }

  public async getSegmentsByRanges(rangeArr: string[]) {
    const segmentNameArr = await this.getSegmentNameArrbyRangeArr(rangeArr);
    return this.logRepository.getSegmentArr(segmentNameArr);
  }

  /**
   * ### Not implemented
   */
  private getSegmentNameArrbyRangeArr(_rangeArr: string[]): Promise<string[]> {
    // range 별로 segmentName 가져오기
    // 중복 제거하기
    // range 에서 아무 segmentName 도 못 얻으면 디폴트인 최근 n일
    // 정렬
    return this.logRepository.getLastSegmentName();
  }

  private monitLog(dataBuffer: B103ExtractedData) {
    if (this.monitorSubject == null) {
      // unreachable
      return;
    }

    this.monitorSubject.next(dataBuffer);

    // console.log(dataBuffer.subarray(0, 6).join(""));
    // console.log(dataBuffer.subarray(6, 7).join(""));
    // console.log(dataBuffer.subarray(7, 23).join(""));
    // console.log(dataBuffer.subarray(23, 39).join(""));
    // console.log(dataBuffer.subarray(39, 55).join(""));
    // console.log(dataBuffer.subarray(55, 71).join(""));
    // console.log(dataBuffer.subarray(71, 87).join(""));
    // console.log(dataBuffer.subarray(87, 103).join(""));
  }

}
