import { createReadStream } from 'fs';
import {
  appendFile,
  readdir,
} from 'fs/promises';
import {
  B19Data,
  getB6Timestamp,
  getKORMidnightMs,
  getKORMs,
  Logger,
  unpackUTCMsB6Timestamp,
} from '../common';
import { DatabaseConfig } from '../config';
import { Readable } from 'stream';
import * as Path from 'path';

export class Byte19LogDatabase {

  private readonly logger = new Logger(Byte19LogDatabase.name);

  private readonly writeBufferMap = new Map<SegmentNumber, WriteBuffer>();

  private batchTimer: NodeJS.Timeout | null = null;

  constructor(
    private readonly databaseConfig: DatabaseConfig,
  ) {
    this.lsSegment(); // getStoragePath 체크, 없으면 에러로 종료.

    this.logger.log('Byte19LogDatabase is initialized.');
  }

  public runBatch() {
    this.batchTimer = setTimeout(() => {
      this.batchTask()
      .catch((err) => {
        console.error(err);
      })
      .finally(() => {
        this.runBatch();
      });
    }, this.databaseConfig.getBatchInterval());

    this.logger.log('Batch Running...');
  }

  public async stopBatch(): Promise<void> {
    if (this.batchTimer != null) {
      clearTimeout(this.batchTimer);
      this.batchTimer = null;
    }
    
    await this.batchTask();
  }

  public append(dataBuffer: B19Data) {
    const segmentNumber = this.getSegmentNumber(dataBuffer);

    if (this.writeBufferMap.has(segmentNumber)) {
      this.writeBufferMap.get(segmentNumber)!.push(dataBuffer);
    } else {
      this.writeBufferMap.set(segmentNumber, [ dataBuffer ]);
    }
  }

  /**
   * @todo 체크섬? 검사 통과한것만 주기
   *
   * 에러는 txt 파일로 ?
   */
  public async readSegment(segmentName: SegmentName): Promise<Readable> {
    if (this.writeBufferMap.has(this.getSegmentNumber(segmentName))) {
      // Todo: 다 읽고 나서 버퍼를 확인하고, 있으면 가져오도록 리팩터링.
      await this.batchTask();
    }

    const filePath = this.getFilePath(segmentName);
    return createReadStream(filePath);
  }

  public lsSegment(): Promise<string[]> {
    return readdir(this.databaseConfig.getStoragePath())
    .then((files) => {
      return files.map((file) => file.split('.')[0]!);
    });
  }

  /**
   * 버퍼에 있는 데이터를 즉시 디스크에 쓴다(노캐싱)  
   * 
   * @todo 실패하는 경우 없어야하지만 만약 있다면 복구전략? 배치쓰기마다 검증데이터/로직 추가하기, 읽을떄 체크해서 배치쓰기 단위로 버릴수 있도록.
   */
  private batchTask(): Promise<void> {
    if (this.writeBufferMap.size == 0) {
      return Promise.resolve();
    }

    const tasks: Promise<string>[] = [];

    this.writeBufferMap.forEach(async (writeBuffer, segmentNumber) => {
      const filePath = this.getFilePath(segmentNumber);
      const data = Buffer.concat(writeBuffer);
      
      this.writeBufferMap.delete(segmentNumber);

      tasks.push(appendFile(filePath, data, {
        flush: true,
      }).then(() => filePath));
    });

    return Promise.all(tasks).then((files) => {
      console.log(`batchTask done: ${files}`);
    });
  }

  private getFilePath(segmentName: SegmentName): string;
  private getFilePath(segmentNumber: SegmentNumber): string;
  private getFilePath(segmentArg: SegmentName | SegmentNumber): string {
    const segmentName = typeof segmentArg == 'string' ? segmentArg : this.getSegmentName(segmentArg);
    return Path.resolve(this.databaseConfig.getStoragePath(), segmentName + '.dat');
  }

  private getSegmentName(segmentNumber: SegmentNumber): SegmentName {
    return new Date(segmentNumber)
    .toLocaleDateString("en-GB", { timeZone: "Asia/Seoul" })
    .split("/")
    .reverse()
    .join("_");
  }

  private getSegmentNumber(dataBuffer: B19Data): SegmentNumber;
  private getSegmentNumber(segmentName: SegmentName): SegmentNumber;
  private getSegmentNumber(arg: B19Data | SegmentName): SegmentNumber {
    if (typeof arg == "string") {
      return getKORMs(this.getUTCMidnightMs(arg));
    } else {
      return getKORMidnightMs(unpackUTCMsB6Timestamp(getB6Timestamp(arg)));
    }
  }

  private getUTCMidnightMs(segmentName: SegmentName): number {
    return new Date(this.getIOSYMD(segmentName)).getTime();
  }

  private getIOSYMD(segmentName: SegmentName): string {
    return segmentName.replace(/_/g, "-");
  }

}

/**
 * byteLength 가 19인 버퍼의 배열
 */
type WriteBuffer = B19Data[];

/**
 * 해당 날짜가 시작하는 자정의 UTC ms (날짜는 한국기준, UTC -9h)  
 */
type SegmentNumber = number;

/**
 * YYYY_MM_DD
 */
type SegmentName = string;

// /**
//  * 2000 ~ 2099
//  */
// type Year = `20${Digit}${Digit}`;
// type Month = `0${PositiveDigit}` | '10' | '11' | '12';
// type Day = `0${PositiveDigit}` | '10' | '11' | '12' | '13' | '14' | '15' | '16' | '17' | '18' | '19' | '20' | '21' | '22' | '23' | '24' | '25' | '26' | '27' | '28' | '29' | '30' | '31';

// type Digit = '0' | PositiveDigit;
// type PositiveDigit = '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9';