import { Observable } from "rxjs";
import {
  B103ExtractedData,
  B12DataWord6,
  B19Data,
  B96ExtractedDataWord6,
  getB12DataWord6,
  getB1Subject,
  getB6Timestamp,
  getB96ExtractedDataWord6
} from "../../common";
import { Byte19LogDatabase as Database } from "../../database";

export class LogRepository {

  constructor(
    private readonly database: Database,
  ) {}

  /**
   * DB 가 분리 되면 비동기로 전환됨
   */
  public create(dataBuffer: B103ExtractedData) {
    this.database.append(this.pack(dataBuffer));
  }

  public getSegmentArr(segmentNameArr: string[]): Segment[] {
    return segmentNameArr.map(segmentName => this.getSegment(segmentName));
  }

  public getSegment(segmentName: string): Segment {
    const dataObx = new Observable<B103ExtractedData[]>(subscriber => {
      this.database.readSegment(segmentName)
      .then(readable => {
        // 19바이트 받을떄마다 unpack해서 Subject 에 next
        let buffer = Buffer.alloc(0);
        let readIdx = 0;

        readable
        .on("data", (chunk: Buffer) => {
          const value: B103ExtractedData[] = [];
          buffer = Buffer.concat([buffer.subarray(readIdx), chunk]);
          readIdx = 0;
          while (buffer.length - readIdx >= 19) {
            const data = buffer.subarray(readIdx, readIdx + 19) as B19Data;
            readIdx += 19;
            value.push(this.unpack(data));
          }
          subscriber.next(value);
        })
        .on("close", () => {
          subscriber.complete();
        })
        .on("error", error => {
          subscriber.error(error);
        });
      });
    });

    return {
      name: segmentName,
      dataObx
    };
  }

  /**
   * 
   * @param num default 5
   */
  public getLastSegmentName(num = 5): Promise<string[]> {
    return this.getSegmentLs().then(segmentNameArr => segmentNameArr.slice(-num));
  }

  public getSegmentLs(): Promise<string[]> {
    return this.database.lsSegment();
  }

  private pack(buffer: B103ExtractedData): B19Data {
    return Buffer.concat([
      getB6Timestamp(buffer),
      getB1Subject(buffer),
      this.packDataWord(getB96ExtractedDataWord6(buffer)),
    ]) as B19Data;
  }

  private unpack(buffer: B19Data): B103ExtractedData {
    return Buffer.concat([
      getB6Timestamp(buffer),
      getB1Subject(buffer),
      this.unpackDataWord(getB12DataWord6(buffer)),
    ]) as B103ExtractedData;
  }

  private packDataWord(buffer: B96ExtractedDataWord6): B12DataWord6 {
    const byteLength = buffer.byteLength / 8; // 12
    const result = Buffer.allocUnsafe(byteLength);
    
    for (let i = 0; i < byteLength; i++) {
      let byte = 0;
      for (let j = 0; j < 8; j++) {
        // bitBuffer[i*8+j]가 0 또는 1임을 가정하고 왼쪽으로 시프트 후 OR 연산
        byte = (byte << 1) | (buffer[i * 8 + j]! & 1);
      }
      result[i] = byte;
    }
    
    return result as B12DataWord6;
  }

  private unpackDataWord(buffer: B12DataWord6): B96ExtractedDataWord6 {
    const result = Buffer.allocUnsafe(buffer.byteLength * 8); // 96
  
    for (let i = 0; i < buffer.byteLength; i++) {
      let byte = buffer[i]!;
      // 상위 비트부터 하나씩 추출하여 bitBuffer에 저장
      for (let j = 7; j >= 0; j--) {
        result[i * 8 + (7 - j)] = (byte >> j) & 1;
      }
    }
    
    return result as B96ExtractedDataWord6;
  }

}

export interface Segment {
  name: string;
  dataObx: Observable<B103ExtractedData[]>;
}
