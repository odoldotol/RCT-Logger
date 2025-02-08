import { Observable, Subject } from "rxjs";
import { B103ExtractedData, B12DataWord6, B19Data, B96ExtractedDataWord6, getB12DataWord6, getB1Subject, getB6Timestamp, getB96ExtractedDataWord6 } from "src/common";
import { Byte19LogDatabase as Database } from "src/database";

export class LogRepository {

  constructor(
    private readonly database: Database,
  ) {}

  public create(dataBuffer: B103ExtractedData) {
    this.database.append(this.pack(dataBuffer));
  }

  public async readSegment(segmentName: string): Promise<Observable<B103ExtractedData[]>> {
    await this.getSegmentLs().then(segmentNameArr => {
      if (!segmentNameArr.includes(segmentName)) {
        throw new Error(`Segment ${segmentName} not found`);
      }
    });

    const subject = new Subject<B103ExtractedData[]>();

    this.database.readSegment(segmentName).then(readable => {
      // 19바이트 받을떄마다 unpack해서 Subject 에 next
      let buffer = Buffer.alloc(0);
      readable
      .on("data", chunk => {
        const value: B103ExtractedData[] = [];
        buffer = Buffer.concat([buffer, chunk]);
        while (buffer.length >= 19) {
          const data = buffer.subarray(0, 19) as B19Data;
          buffer = buffer.subarray(19);
          value.push(this.unpack(data));
        }
        subject.next(value);
      })
      .on("end", () => {
      })
      .on("close", () => {
        subject.complete();
      })
      .on("error", error => {
        subject.error(error);
      });
    });

    return subject.asObservable();
  }

  public getLastSegmentName(num = 5): Promise<string[]> {
    return this.getSegmentLs().then(segmentNameArr => segmentNameArr.slice(-num));
  }

  private getSegmentLs(): Promise<string[]> {
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
