import { ReceiverInterface } from "../../..//logger/ioInterface";
import { Observable } from "rxjs";
import {
  B103ExtractedData,
  Logger,
  Router
} from "../../..//common";
import { LogController } from "../log";

export class ReceiverRouter
  implements Router
{

  private readonly logger = new Logger(ReceiverRouter.name);

  private readonly receiverDataStream: Observable<B103ExtractedData>;

  constructor(
    private readonly receiverInterface: ReceiverInterface,
    private readonly logController: LogController
  ) {
    this.receiverDataStream = this.receiverInterface.getDataStream();
  }

  public listen() {
    this.receiverDataStream
    // .pipe() // address 검증 => 순서 틀리면 워드 순서 조정
    .subscribe(
      dataBuffer => {
        this.logController.log(dataBuffer);
      }
    );

    this.logger.log("ReceiverRouter is listening.");
  }
 
}

// enum DataStructureIdx {
//   DataWord1,
//   DataWordMCA,
//   DataWord2,
//   DataWord3,
//   DataWord4,
//   DataWord5,
// }

// class Data {

//   private readonly structureIdx = DataStructureIdx;
//   private readonly wordLength = 32;
//   private readonly addressLength = 3;


//   public header: DataHeader;
//   public body: DataBody | null = null;

//   constructor(
//     private readonly dataBuffer: DataBuffer,
//   ) {
//     const timestampBuffer = dataBuffer.subarray(0, 6) as TimeBuffer;

//     this.header = {
//       timestamp: restoreTimeBuffer(timestampBuffer),
//       ar20: null,
//     };

//     if (dataBuffer.byteLength == 7) {
//       this.header.ar20 = dataBuffer[6]!;
//     } else if (dataBuffer.byteLength == 198) {
//       this.body = {
//         startOff: (this.structureIdx.DataWord2, 8)
//       }

//     } else {
//       dataBuffer satisfies never;
//     }
//   }

//   private getBool(
//     structureIdx: DataStructureIdx,
//     dataIdx: number
//   ): boolean {

//   }

// }

// type DataHeader = {
//   timestamp: Date;
//   ar20: Ar20 | null;
//   loggerStatus: LoggerStatus | null;
// };

// const enum LoggerStatus {
//   TurnedOff,
//   TurnedOn,
// }

// type DataBody = {
//   deviceAddress: number | null;
//   opA: boolean;
//   opB: boolean;
//   MCAData: number | null;
//   trollyTravel: TrollyTravel | null;
//   bridgeTravel: BridgeTravel | null;
//   startOff: boolean;
//   startOn: boolean;
//   siren: boolean;
//   light: boolean;
//   mainHoist: MainHoist | null;
//   auxHoist: AuxHoist | null;
//   aux1: boolean;
//   aux2: boolean;
//   aux3: boolean;
//   aux4: boolean;
//   sp1: boolean;
//   sp2: boolean;
//   sp3: boolean;
//   sp4: boolean;
//   sp5: boolean;
//   sp6: boolean;
//   sp7: boolean;
//   sp8: boolean;
//   sp9: boolean;
//   sp10: boolean;
//   sp11: boolean;
//   sp12: boolean;
//   sp13: boolean;
//   sp14: boolean;
//   sp15: boolean;
//   sp16: boolean;
//   sp17: boolean;
//   sp18: boolean;
//   sp19: boolean;
//   sp20: boolean;
//   sp21: boolean;
//   sp22: boolean;
//   sp23: boolean;
//   sp24: boolean;
// };

// /**
//  * 횡행 전|후
//  */
// const enum TrollyTravel {
//   F1, // 1000
//   F2, // 1010
//   F3, // 1001
//   F4, // 1011
//   B1, // 0100
//   B2, // 0110
//   B3, // 0111
//   B4, // 0101
// }

// /**
//  * 주행 좌|우
//  */
// const enum BridgeTravel {
//   L1, // 0100
//   L2, // 0110
//   L3, // 0101
//   L4, // 0111
//   R1, // 1000
//   R2, // 1010
//   R3, // 1001
//   R4, // 1011
// }

// /**
//  * M 권상|하
//  */
// const enum MainHoist {
//   U1, // 1000
//   U2, // 1010
//   U3, // 1001
//   U4, // 1011
//   D1, // 0100
//   D2, // 0110
//   D3, // 0101
//   D4, // 0111
// }

// /**
//  * A 권상|하
//  */
// const enum AuxHoist {
//   U1, // 1000
//   U2, // 1010
//   U3, // 1001
//   U4, // 1011
//   D1, // 0100
//   D2, // 0110
//   D3, // 0101
//   D4, // 0111
// }
