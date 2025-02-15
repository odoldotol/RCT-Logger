import {
  B103ExtractedData,
  B96ExtractedDataWord6,
  getB1Subject,
  getB6Timestamp,
  getB96ExtractedDataWord6,
  SubjectValue,
  unpackUTCMsB6Timestamp
} from "../../../common";

export class LogFactory {
  
  /**
   * @todo 최적화
   */
  public create(dataBuffer: B103ExtractedData): Log {
    const header: LogHeader = {
      timestamp: unpackUTCMsB6Timestamp(getB6Timestamp(dataBuffer)),
      subject: getB1Subject(dataBuffer)[0]!,
    };

    const data = getB96ExtractedDataWord6(dataBuffer);

    const body: LogBody = {
      deviceAddress: this.bufferToNumber(this.getBuffer(DataStructureIdx.DataWord1, 3, 12, data)),
      opA: this.getBit(DataStructureIdx.DataWord1, 13, data),
      opB: this.getBit(DataStructureIdx.DataWord1, 14, data),
      MCAData: this.bufferToNumber(this.getBuffer(DataStructureIdx.DataWordMCA, 3, 14, data)),
      trollyTravel: this.getTrollyTravel(this.getBuffer(DataStructureIdx.DataWord2, 3, 6, data)),
      bridgeTravel: this.getBridgeTravel(this.getBuffer(DataStructureIdx.DataWord2, 7, 10, data)),
      startOff: this.getBit(DataStructureIdx.DataWord2, 11, data),
      startOn: this.getBit(DataStructureIdx.DataWord2, 12, data),
      siren: this.getBit(DataStructureIdx.DataWord2, 13, data),
      light: this.getBit(DataStructureIdx.DataWord2, 14, data),
      mainHoist: this.getMainHoist(this.getBuffer(DataStructureIdx.DataWord3, 3, 6, data)),
      auxHoist: this.getAuxHoist(this.getBuffer(DataStructureIdx.DataWord3, 7, 10, data)),
      aux1: this.getBit(DataStructureIdx.DataWord3, 11, data),
      aux2: this.getBit(DataStructureIdx.DataWord3, 12, data),
      aux3: this.getBit(DataStructureIdx.DataWord3, 13, data),
      aux4: this.getBit(DataStructureIdx.DataWord3, 14, data),
      sp1: this.getBit(DataStructureIdx.DataWord4, 3, data),
      sp2: this.getBit(DataStructureIdx.DataWord4, 4, data),
      sp3: this.getBit(DataStructureIdx.DataWord4, 5, data),
      sp4: this.getBit(DataStructureIdx.DataWord4, 6, data),
      sp5: this.getBit(DataStructureIdx.DataWord4, 7, data),
      sp6: this.getBit(DataStructureIdx.DataWord4, 8, data),
      sp7: this.getBit(DataStructureIdx.DataWord4, 9, data),
      sp8: this.getBit(DataStructureIdx.DataWord4, 10, data),
      sp9: this.getBit(DataStructureIdx.DataWord4, 11, data),
      sp10: this.getBit(DataStructureIdx.DataWord4, 12, data),
      sp11: this.getBit(DataStructureIdx.DataWord4, 13, data),
      sp12: this.getBit(DataStructureIdx.DataWord4, 14, data),
      sp13: this.getBit(DataStructureIdx.DataWord5, 3, data),
      sp14: this.getBit(DataStructureIdx.DataWord5, 4, data),
      sp15: this.getBit(DataStructureIdx.DataWord5, 5, data),
      sp16: this.getBit(DataStructureIdx.DataWord5, 6, data),
      sp17: this.getBit(DataStructureIdx.DataWord5, 7, data),
      sp18: this.getBit(DataStructureIdx.DataWord5, 8, data),
      sp19: this.getBit(DataStructureIdx.DataWord5, 9, data),
      sp20: this.getBit(DataStructureIdx.DataWord5, 10, data),
      sp21: this.getBit(DataStructureIdx.DataWord5, 11, data),
      sp22: this.getBit(DataStructureIdx.DataWord5, 12, data),
      sp23: this.getBit(DataStructureIdx.DataWord5, 13, data),
      sp24: this.getBit(DataStructureIdx.DataWord5, 14, data),
    };

    return new Log(
      header,
      body,
    );
  }

  private getTrollyTravel(buffer: Buffer): TrollyTravel | null {
    this.validate4Bit(buffer);

    switch (this.bufferToNumber(buffer)) {
      case 0b1000: return TrollyTravel.F1;
      case 0b1010: return TrollyTravel.F2;
      case 0b1001: return TrollyTravel.F3;
      case 0b1011: return TrollyTravel.F4;
      case 0b0100: return TrollyTravel.B1;
      case 0b0110: return TrollyTravel.B2;
      case 0b0111: return TrollyTravel.B3;
      case 0b0101: return TrollyTravel.B4;
      default: return null;
    }
  }

  private getBridgeTravel(buffer: Buffer): BridgeTravel | null {
    this.validate4Bit(buffer);

    switch (this.bufferToNumber(buffer)) {
      case 0b0100: return BridgeTravel.L1;
      case 0b0110: return BridgeTravel.L2;
      case 0b0101: return BridgeTravel.L3;
      case 0b0111: return BridgeTravel.L4;
      case 0b1000: return BridgeTravel.R1;
      case 0b1010: return BridgeTravel.R2;
      case 0b1001: return BridgeTravel.R3;
      case 0b1011: return BridgeTravel.R4;
      default: return null;
    }
  }

  private getMainHoist(buffer: Buffer): MainHoist | null {
    this.validate4Bit(buffer);

    switch (this.bufferToNumber(buffer)) {
      case 0b1000: return MainHoist.U1;
      case 0b1010: return MainHoist.U2;
      case 0b1001: return MainHoist.U3;
      case 0b1011: return MainHoist.U4;
      case 0b0100: return MainHoist.D1;
      case 0b0110: return MainHoist.D2;
      case 0b0101: return MainHoist.D3;
      case 0b0111: return MainHoist.D4;
      default: return null;
    }
  }

  private getAuxHoist(buffer: Buffer): AuxHoist | null {
    this.validate4Bit(buffer);

    switch (this.bufferToNumber(buffer)) {
      case 0b1000: return AuxHoist.U1;
      case 0b1010: return AuxHoist.U2;
      case 0b1001: return AuxHoist.U3;
      case 0b1011: return AuxHoist.U4;
      case 0b0100: return AuxHoist.D1;
      case 0b0110: return AuxHoist.D2;
      case 0b0101: return AuxHoist.D3;
      case 0b0111: return AuxHoist.D4;
      default: return null;
    }
  }

  private validate4Bit(buffer: Buffer): void {
    if (buffer.length !== 4) {
      throw new Error(`Invalid buffer length: ${buffer.length}`);
    }
  }

  /**
   * 각 비트를 왼쪽으로 시프트하고, 계산할 비트를 OR 연산으로 결합
   * 
   * MAX_SAFE_INTEGER 초과하지 않으려면 53비트까지만 가능
   */
  private bufferToNumber(buffer: Buffer): number {
    if (buffer.length > 53) {
      throw new Error(`length is too long: ${buffer.length}`);
    }

    let result = 0;

    for (let i = 0; i < buffer.length; i++) {
      result = (result << 1) | buffer[i]!;
    }

    return result;
  }

  private getBit(
    word: DataStructureIdx,
    wordIdx: number,
    data: B96ExtractedDataWord6,
  ): boolean {
    if (wordIdx < 0 || wordIdx > 15) {
      throw new Error(`Invalid word index: ${wordIdx}`);
    }

    const idx = word * 16 + wordIdx;

    return data[idx]! === 1;
  };

  private getBuffer = (
    word: DataStructureIdx,
    start: number,
    end: number,
    data: B96ExtractedDataWord6,
  ) => {
    if (start < 0 || start > 15 || end < 0 || end > 15) {
      throw new Error(`Invalid start or end index: ${start}, ${end}`);
    }

    const idx = word * 16 + start;
    const length = end - start + 1;

    return data.subarray(idx, idx + length);
  }

}

export class Log {

  constructor(
    public readonly header: LogHeader,
    public readonly body: LogBody,
  ) {}

}

enum DataStructureIdx {
  DataWord1,
  DataWordMCA,
  DataWord2,
  DataWord3,
  DataWord4,
  DataWord5,
}

type LogHeader = Readonly<{
  timestamp: number;
  subject: SubjectValue;
}>;

type LogBody = Readonly<{
  deviceAddress: number | null;
  opA: boolean;
  opB: boolean;
  MCAData: number | null;
  trollyTravel: TrollyTravel | null;
  bridgeTravel: BridgeTravel | null;
  startOff: boolean;
  startOn: boolean;
  siren: boolean;
  light: boolean;
  mainHoist: MainHoist | null;
  auxHoist: AuxHoist | null;
  aux1: boolean;
  aux2: boolean;
  aux3: boolean;
  aux4: boolean;
  sp1: boolean;
  sp2: boolean;
  sp3: boolean;
  sp4: boolean;
  sp5: boolean;
  sp6: boolean;
  sp7: boolean;
  sp8: boolean;
  sp9: boolean;
  sp10: boolean;
  sp11: boolean;
  sp12: boolean;
  sp13: boolean;
  sp14: boolean;
  sp15: boolean;
  sp16: boolean;
  sp17: boolean;
  sp18: boolean;
  sp19: boolean;
  sp20: boolean;
  sp21: boolean;
  sp22: boolean;
  sp23: boolean;
  sp24: boolean;
}>;

/**
 * 횡행 전|후
 */
const enum TrollyTravel {
  F1, // 1000
  F2, // 1010
  F3, // 1001
  F4, // 1011
  B1, // 0100
  B2, // 0110
  B3, // 0111
  B4, // 0101
}

/**
 * 주행 좌|우
 */
const enum BridgeTravel {
  L1, // 0100
  L2, // 0110
  L3, // 0101
  L4, // 0111
  R1, // 1000
  R2, // 1010
  R3, // 1001
  R4, // 1011
}

/**
 * M 권상|하
 */
const enum MainHoist {
  U1, // 1000
  U2, // 1010
  U3, // 1001
  U4, // 1011
  D1, // 0100
  D2, // 0110
  D3, // 0101
  D4, // 0111
}

/**
 * A 권상|하
 */
const enum AuxHoist {
  U1, // 1000
  U2, // 1010
  U3, // 1001
  U4, // 1011
  D1, // 0100
  D2, // 0110
  D3, // 0101
  D4, // 0111
}
