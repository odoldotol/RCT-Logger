import { B103ExtractedData } from "../../../common";
import { LogRepository } from "../../../logger/database";
import { LogFactory } from "./log.factory";
import { LoggerConfig } from "../../../config/logger";

export class LogService {

  constructor(
    private readonly loggerConfig: LoggerConfig,
    private readonly logFactory: LogFactory,
    private readonly logRepository: LogRepository
  ) {}

  /**
   * DB 가 분리 되면 비동기로 전환됨
   */
  public log(dataBuffer: B103ExtractedData) {
    if (this.loggerConfig.isLogMonit()) {
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

  /**
   * @todo 초당 1개씩 평균내는 로직 + 엑셀 데이터변환 로직 그대로 적용해서 엑셀 출력 예시 모니터링하기
   */
  private monitLog(dataBuffer: B103ExtractedData) {
    // console.log(dataBuffer.subarray(0, 6).join(""));
    // console.log(dataBuffer.subarray(6, 7).join(""));
    // console.log(dataBuffer.subarray(7, 23).join(""));
    // console.log(dataBuffer.subarray(23, 39).join(""));
    // console.log(dataBuffer.subarray(39, 55).join(""));
    // console.log(dataBuffer.subarray(55, 71).join(""));
    // console.log(dataBuffer.subarray(71, 87).join(""));
    // console.log(dataBuffer.subarray(87, 103).join(""));

    console.log(this.logFactory.create(dataBuffer));
  }

}
