import { Buffer } from 'buffer'
import { Level } from 'src/common';
import {
  Transform,
  TransformCallback
} from 'stream'

/**
 * 
 */
export class RCTProtocol
  extends Transform
{
  private buffer = Buffer.allocUnsafe(2048);
  private bufferLength = 0;

  private readonly wordLength = 32;
  private readonly cycleLength = 224;

  private syncronized = false;
  private syncWordCnt = 1;

  constructor() {
    super();
  }

  override _transform(
    chunk: Buffer,
    _encoding: BufferEncoding,
    cb: TransformCallback
  ) {
    chunk.forEach(level => {
      this.processSerial(level);
    });

    cb()
  }

  override _flush(cb: TransformCallback) {
    this.reset();
    cb()
  }

  public reset() {
    this.bufferLength = 0;
    this.syncronized = false;
    this.syncWordCnt = 1;
  }

  private processSerial(level: Level) {
    const isSyncWord = this.findSyncWord(level);
    if ( // 버퍼에 저장
      !isSyncWord &&
      this.syncronized
    ) {

      this.pushToBuffer(level);

    } else if ( // 싱크워드 찾음, 데이터 푸시
      isSyncWord &&
      this.syncronized
    ) {

      if (this.bufferLength == 223) {
        const end = 1 + this.bufferLength - this.wordLength; // 192
        const start = end - this.cycleLength + this.wordLength // 0
        const cycle = this.buffer.subarray(start, end); // 길이 192

        // 검증 (패리티, 반전) - ar20 으로 대체 / 부족하면 구현필요

        this.push(Buffer.from(cycle));
      } else {
        // 보정(클락유실, 복수사이클)
        // 보정이후 검증필요. => 어차피 검증 필요하면 223 일때도 검증 하지 뭐...
      }

      this.bufferLength = 0;

    } else if ( // 최초 싱크워드 찾음
      isSyncWord &&
      !this.syncronized
    ) {

      this.syncronized = true;

    }
  }

  private findSyncWord(level: Level) {
    if (this.syncWordCnt == 1) {
      level == 1 && this.syncWordCnt++;
    } else if (
      2 <= this.syncWordCnt &&
      this.syncWordCnt <= 30
    ) {
      level == 0 ? this.syncWordCnt++ : this.syncWordCnt = 2;
    } else if (this.syncWordCnt == 31) {
      level == 1 ? this.syncWordCnt++ : this.syncWordCnt = 1;
    } else if (this.syncWordCnt == 32) {
      this.syncWordCnt = 1;
      return level == 1;
    }
    return false;
  }

  private pushToBuffer(level: Level) {
    this.buffer[this.bufferLength++] = level;
  }

}
