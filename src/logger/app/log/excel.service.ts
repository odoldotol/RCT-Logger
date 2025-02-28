import { WriteStream } from "fs";
import { SubjectValue } from "../../../common";
import ExcelJS, {
  BorderStyle
} from "exceljs";
import {
  AuxHoist,
  BridgeTravel,
  Log,
  LogBody,
  LogFactory,
  MainHoist,
  TrollyTravel,
} from "./log.factory";
import * as X from "rxjs/operators";
import { Segment } from "../../database";
import {
  Observable,
  OperatorFunction
} from "rxjs";

export class LogExcelService {

  private readonly T = 'O';
  private readonly F = '';
  private readonly ON = 'ON';
  private readonly OFF = 'OFF';

  private readonly Color = {
    header_timestamp: 'fcd5b4',
    header_basic: 'd9d9d9',
    header_aux: 'e6b8b7',
    header_travel_hoist: 'da9694',
    header_sp: 'c5d9f1',

    row_txOn: '91d051',
    row_txOff: 'bfbfbf',
    cell_op: 'ff501b',
    cell_startOn: 'c4d79b',
    cell_basic: 'd9d9d9',
    cell_aux: 'fabf8f',
    cell_travel_hoist: 'da9694',
    cell_sp: '538dd5',
  }

  constructor(
    private readonly logFactory: LogFactory,
  ) {}

  public async write(
    writeStream: WriteStream,
    segmentArr: Segment[],
  ): Promise<void> {
    const streamWorkbook = this.createStreamWorkbook(writeStream);

    // 세그먼트 하나씩만 R/W
    for (const segment of segmentArr) {
      const sheet = this.createSheet(streamWorkbook, segment.name);

      await this.writeSegmnetOnSheet(segment, sheet);

      sheet.commit();
    }

    await streamWorkbook.commit();
  }

  private writeSegmnetOnSheet(
    segment: Segment,
    sheet: ExcelJS.Worksheet,
  ): Promise<void> {
    return new Promise<void>((resolve, reject) => { 

      const subscription = segment.dataObx.pipe(
        X.map(dataArr => dataArr.map(data => this.logFactory.create(data))),
        this.summarizeLogsBySecond(),
      ).subscribe({
        next: logArr => {
          logArr.forEach(log => {
            const row = sheet.addRow(this.createRowData(log));

            this.style(row);
            this.fillTxOnOffRow(row);
          });

          try {
            sheet.lastRow?.commit();
          } catch (error) {
            subscription.unsubscribe();
            reject(error);
          }
        },
        error: reject,
        complete: resolve,
      });
    });
  }

  private style(row: ExcelJS.Row): void {
    row.eachCell(cell => {
      cell.alignment = { vertical: 'middle', horizontal: 'center' };

      if (
        cell.fullAddress.col != 1 &&
        cell.fullAddress.col != 2 &&
        cell.fullAddress.col != 6
      ) {
        cell.font = { bold: true };
      }

      if (
        cell.fullAddress.col == 1 ||
        cell.fullAddress.col == 3 ||
        cell.fullAddress.col == 5 ||
        cell.fullAddress.col == 6 ||
        cell.fullAddress.col == 8 ||
        cell.fullAddress.col == 12 ||
        cell.fullAddress.col == 19 ||
        cell.fullAddress.col == 26 ||
        cell.fullAddress.col == 33 ||
        cell.fullAddress.col == 40 ||
        cell.fullAddress.col == 52 ||
        cell.fullAddress.col == 64 ||
        cell.fullAddress.col == 65
      ) {
        cell.border = { right: { style: 'thin' } };
      }

      if ( // StartOn
        cell.value == this.ON &&
        cell.fullAddress.col == 6
      ) {
        cell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: this.Color.cell_startOn },
        };
      }

      if (cell.value == this.T) {
        let argb: string;
        if ( // OP
          cell.fullAddress.col == 4 ||
          cell.fullAddress.col == 5
        ) {
          argb = this.Color.cell_op;
        } else if ( // Siren, Light
          cell.fullAddress.col == 7 ||
          cell.fullAddress.col == 8
        ) {
          argb = this.Color.cell_basic;
        } else if ( // Aux1-4
          9 <= cell.fullAddress.col &&
          cell.fullAddress.col <= 12
        ) {
          argb = this.Color.cell_aux;
        } else if ( // Travel, Hoist
          13 <= cell.fullAddress.col &&
          cell.fullAddress.col <= 40
        ) {
          argb = this.Color.cell_travel_hoist;
        } else if ( // SP
          41 <= cell.fullAddress.col &&
          cell.fullAddress.col <= 64
        ) {
          argb = this.Color.cell_sp;
        } else {
          argb = '';
        }

        if (argb != '') {
          cell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb },
          };
        }
      }
    });
  }

  private fillTxOnOffRow(row: ExcelJS.Row): void {
    const txOnoffCell = row.findCell(3);
    if (txOnoffCell && txOnoffCell.value != this.F) {
      let argb: string;

      switch (txOnoffCell.value) {
        case this.ON:
          argb = this.Color.row_txOn;
          break;
        case this.OFF:
          argb = this.Color.row_txOff;
          break;
        default:
          return;
      }

      row.eachCell(cell => {
        cell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb },
        };
      });
    }
  }

  /**
   * 스트림읽기에서 들어온 데이터가 그대로 쓰기스트림으로 나가도록 구현하기 쉽도록 next : next
   */
  public summarizeLogsBySecond(): OperatorFunction<Log[], Log[]> {
    return (source: Observable<Log[]>) => new Observable<Log[]>(subscriber => {
      
      const result: Log[] = [];
      
      /**
       * 1200bps 기준 5-6개정도가 1초, +1 개는 직전 1개  
       * idx 0: 직전sec 1개, idx 1~6: 현재sec의 6개
       */
      const secLogArr: Log[] = Array(7);
      let secLogArrLength = 1; // 이전 sec log 1개 비워두기
      let isFirst = true;

      let secTime = 0;

      const pushSecLog = (log: Log) => {
        secLogArr[secLogArrLength++] = log;
      };

      const pushResult = () => {
        if (secLogArrLength >= 4) { // 현재sec log 가 3개 이상
          let startIdx = 0;
          if (isFirst == true) {
            startIdx = 1;
            isFirst = false;
          }

          result.push(this.logFactory.summarizeDataLogs(secLogArr.slice(startIdx, secLogArrLength), secTime));
        }
      };

      const subscription = source.subscribe({
        next: logArr => {
          try {
            logArr.forEach(log => {
              if (log.header.subject == SubjectValue.Data) {
                const secTimeTemp = Math.floor(log.header.timestamp / 1000) * 1000
                if (secTime == secTimeTemp) {
                  pushSecLog(log);
                } else {
                  pushResult();
                  secTime = secTimeTemp;

                  // 직전sec last log 를 idx0 에 넣고 secLogArrLength 를 1 로 할당
                  secLogArr[0] = secLogArr[secLogArrLength-1]!;
                  secLogArrLength = 1;

                  pushSecLog(log);
                }
              } else {
                result.push(log);
              }
            });

            subscriber.next(result);
            result.length = 0;
          } catch (error) {
            subscriber.error(error);
          }
        },
        error: err => {
          subscriber.error(err);
        },
        complete: () => {
          try {
            pushResult();
            subscriber.next(result);
            subscriber.complete();
          } catch (error) {
            subscriber.error(error);
          }
        }
      });

      return () => subscription.unsubscribe();
    });
  }

  private createRowData(
    log: Log
  ): Record<RowDataKey, any> | string[] {
    const timestamp = new Date(log.header.timestamp).toLocaleTimeString("en-GB", { timeZone: "Asia/Seoul" });

    if (log.isDataLog()) {
      const result: Record<RowDataKey, any> = Object.assign(
        {
          timestamp, 
          ar20Onoff: this.F,
          ...log.body
        },
        this.trollyTravel(log),
        this.bridgeTravel(log),
        this.mainHoist(log),
        this.auxHoist(log)
      );

      // boolean to string // Todo: startOn 처리 뷴리하기
      for (const k in result) {
        if (result[k as RowDataKey] === false) {
          result[k as RowDataKey] = this.F;
        } else if (result[k as RowDataKey] === true) {
          k == 'startOn' ? result[k as RowDataKey] = this.ON : result[k as RowDataKey] = this.T;
        }
      }

      return result;
    } else {
      const result = Array(65).fill(this.F);
      result[0] = timestamp;
      result[2] = log.header.subject == SubjectValue.Ar20TurnedOn ? this.ON : this.OFF;
      return result;
    }
  }

  /**
   * @todo 통합
   */
  private trollyTravel(log: Log<SubjectValue.Data>) {
    let
    trollyTravel = this.F,
    trollyTravel_F = this.F,
    trollyTravel_B = this.F,
    trollyTravel_1 = this.F,
    trollyTravel_2 = this.F,
    trollyTravel_3 = this.F,
    trollyTravel_4 = this.F;

    if (log.body.trollyTravel != null) {
      let value: number = log.body.trollyTravel;
      3 < value ? (value = value - 4, trollyTravel_B = this.T) : trollyTravel_F = this.T;

      trollyTravel = TrollyTravel[log.body.trollyTravel]
      trollyTravel_1 = this.T;
      trollyTravel_2 = 0 < value ? this.T : this.F;
      trollyTravel_3 = 1 < value ? this.T : this.F;
      trollyTravel_4 = 2 < value ? this.T : this.F;
    }

    return {
      trollyTravel,
      trollyTravel_F,
      trollyTravel_B,
      trollyTravel_1,
      trollyTravel_2,
      trollyTravel_3,
      trollyTravel_4,
    };
  }

  /**
   * @todo 통합
   */
  private bridgeTravel(log: Log<SubjectValue.Data>) {
    let
    bridgeTravel = this.F,
    bridgeTravel_L = this.F,
    bridgeTravel_R = this.F,
    bridgeTravel_1 = this.F,
    bridgeTravel_2 = this.F,
    bridgeTravel_3 = this.F,
    bridgeTravel_4 = this.F;

    if (log.body.bridgeTravel != null) {
      let value: number = log.body.bridgeTravel;
      3 < value ? (value = value - 4, bridgeTravel_R = this.T) : bridgeTravel_L = this.T;

      bridgeTravel = BridgeTravel[log.body.bridgeTravel]
      bridgeTravel_1 = this.T;
      bridgeTravel_2 = 0 < value ? this.T : this.F;
      bridgeTravel_3 = 1 < value ? this.T : this.F;
      bridgeTravel_4 = 2 < value ? this.T : this.F;
    }

    return {
      bridgeTravel,
      bridgeTravel_L,
      bridgeTravel_R,
      bridgeTravel_1,
      bridgeTravel_2,
      bridgeTravel_3,
      bridgeTravel_4,
    };
  }

  /**
   * @todo 통합
   */
  private mainHoist(log: Log<SubjectValue.Data>) {
    let
    mainHoist = this.F,
    mainHoist_U = this.F,
    mainHoist_D = this.F,
    mainHoist_1 = this.F,
    mainHoist_2 = this.F,
    mainHoist_3 = this.F,
    mainHoist_4 = this.F;

    if (log.body.mainHoist != null) {
      let value: number = log.body.mainHoist;
      3 < value ? (value = value - 4, mainHoist_D = this.T) : mainHoist_U = this.T;

      mainHoist = MainHoist[log.body.mainHoist]
      mainHoist_1 = this.T;
      mainHoist_2 = 0 < value ? this.T : this.F;
      mainHoist_3 = 1 < value ? this.T : this.F;
      mainHoist_4 = 2 < value ? this.T : this.F;
    }

    return {
      mainHoist,
      mainHoist_U,
      mainHoist_D,
      mainHoist_1,
      mainHoist_2,
      mainHoist_3,
      mainHoist_4,
    };
  }

  /**
   * @todo 통합
   */
  private auxHoist(log: Log<SubjectValue.Data>) {
    let
    auxHoist = this.F,
    auxHoist_U = this.F,
    auxHoist_D = this.F,
    auxHoist_1 = this.F,
    auxHoist_2 = this.F,
    auxHoist_3 = this.F,
    auxHoist_4 = this.F;

    if (log.body.auxHoist != null) {
      let value: number = log.body.auxHoist;
      3 < value ? (value = value - 4, auxHoist_D = this.T) : auxHoist_U = this.T;

      auxHoist = AuxHoist[log.body.auxHoist]
      auxHoist_1 = this.T;
      auxHoist_2 = 0 < value ? this.T : this.F;
      auxHoist_3 = 1 < value ? this.T : this.F;
      auxHoist_4 = 2 < value ? this.T : this.F;
    }

    return {
      auxHoist,
      auxHoist_U,
      auxHoist_D,
      auxHoist_1,
      auxHoist_2,
      auxHoist_3,
      auxHoist_4,
    };
  }

  private createStreamWorkbook(
    writeStream: WriteStream
  ): ExcelJS.stream.xlsx.WorkbookWriter {
    const book = new ExcelJS.stream.xlsx.WorkbookWriter({
      stream: writeStream,
      useStyles: true,
    });

    book.creator = 'Lygorithm from RCT.';
    book.created = new Date();

    return book;
  }

  private createSheet(
    streamWorkbook: ExcelJS.stream.xlsx.WorkbookWriter,
    segmentName: string,
  ): ExcelJS.Worksheet {
    const sheet = streamWorkbook.addWorksheet(segmentName, {
      views: [ { state: 'frozen', xSplit: 8, ySplit: 3 } ]
    });

    // 스트리밍모드에서 칼럼에 alignment, style 설정해도 적용이 안되는것같음
    const columnArr: (Partial<ExcelJS.Column> & { key: RowDataKey })[] = [
      { key: 'timestamp', width: 14, header: 'Timestamp' },

      // TX
      { key: "deviceAddress", width: 8, header: 'ID' },
      { key: 'ar20Onoff', width: 8, header: 'ON/Off' },

      // OP
      { key: "opA", width: 6, header: 'EM2' },
      { key: "opB", width: 6, header: 'OP_B' },

      { key: "startOn", width: 10, header: 'Start On' },

      { key: "siren", width: 8, header: 'Siren' },
      { key: "light", width: 8, header: 'Light' },

      { key: "aux1", width: 5, header: '1' },
      { key: "aux2", width: 5, header: '2' },
      { key: "aux3", width: 5, header: '3' },
      { key: "aux4", width: 5, header: '4' },

      // trollyTravel 횡행 7행
      { key: "trollyTravel", width: 8, header: 'NOTCH' },
      { key: "trollyTravel_F", width: 5, header: 'F' },
      { key: "trollyTravel_B", width: 5, header: 'B' },
      { key: "trollyTravel_1", width: 5, header: '1' },
      { key: "trollyTravel_2", width: 5, header: '2' },
      { key: "trollyTravel_3", width: 5, header: '3' },
      { key: "trollyTravel_4", width: 5, header: '4' },

      // bridgeTravel 주행 7행
      { key: "bridgeTravel", width: 8, header: 'NOTCH' },
      { key: "bridgeTravel_L", width: 5, header: 'L' },
      { key: "bridgeTravel_R", width: 5, header: 'R' },
      { key: "bridgeTravel_1", width: 5, header: '1' },
      { key: "bridgeTravel_2", width: 5, header: '2' },
      { key: "bridgeTravel_3", width: 5, header: '3' },
      { key: "bridgeTravel_4", width: 5, header: '4' },

      // mainHoist Main 7행
      { key: "mainHoist", width: 8, header: 'NOTCH' },
      { key: "mainHoist_U", width: 5, header: 'U' },
      { key: "mainHoist_D", width: 5, header: 'D' },
      { key: "mainHoist_1", width: 5, header: '1' },
      { key: "mainHoist_2", width: 5, header: '2' },
      { key: "mainHoist_3", width: 5, header: '3' },
      { key: "mainHoist_4", width: 5, header: '4' },

      // auxHoist Aux 7행
      { key: "auxHoist", width: 8, header: 'NOTCH' },
      { key: "auxHoist_U", width: 5, header: 'U' },
      { key: "auxHoist_D", width: 5, header: 'D' },
      { key: "auxHoist_1", width: 5, header: '1' },
      { key: "auxHoist_2", width: 5, header: '2' },
      { key: "auxHoist_3", width: 5, header: '3' },
      { key: "auxHoist_4", width: 5, header: '4' },

      // SP
      { key: "sp1", width: 5, header: 'A1' },
      { key: "sp2", width: 5, header: 'A2' },
      { key: "sp3", width: 5, header: 'A3' },
      { key: "sp4", width: 5, header: 'A4' },
      { key: "sp5", width: 5, header: 'A5' },
      { key: "sp6", width: 5, header: 'A6' },
      { key: "sp7", width: 5, header: 'A7' },
      { key: "sp8", width: 5, header: 'A8' },
      { key: "sp9", width: 5, header: 'A9' },
      { key: "sp10", width: 5, header: 'A10' },
      { key: "sp11", width: 5, header: 'A11' },
      { key: "sp12", width: 5, header: 'A12' },

      { key: "sp13", width: 5, header: 'B1' },
      { key: "sp14", width: 5, header: 'B2' },
      { key: "sp15", width: 5, header: 'B3' },
      { key: "sp16", width: 5, header: 'B4' },
      { key: "sp17", width: 5, header: 'B5' },
      { key: "sp18", width: 5, header: 'B6' },
      { key: "sp19", width: 5, header: 'B7' },
      { key: "sp20", width: 5, header: 'B8' },
      { key: "sp21", width: 5, header: 'B9' },
      { key: "sp22", width: 5, header: 'B10' },
      { key: "sp23", width: 5, header: 'B11' },
      { key: "sp24", width: 5, header: 'B12' },

      { key: "MCAData", width: 12, header: 'MCA Data' },
    ];

    sheet.columns = columnArr.map(column => {
      const { header, ...rest } = column;
      return rest;
    });

    // header
    sheet.getCell('A1').value = '';
    sheet.getRow(1).commit();

    sheet.getCell('A2').value = segmentName;

    sheet.mergeCells('B2:C2');
    sheet.getCell('B2').value = 'TRANSMITTER';

    sheet.mergeCells('D2:H2');
    sheet.getCell('D2').value = 'POWER';

    sheet.mergeCells('I2:L2'); // aux1-4
    sheet.getCell('I2').value = 'AUX';

    sheet.mergeCells('M2:S2');
    const trollyTravelHead = sheet.getCell('M2');
    trollyTravelHead.value = 'TRAVERSING';
    trollyTravelHead.note = '횡행 (Trolly Travel)';

    sheet.mergeCells('T2:Z2');
    const bridgeTravelHead = sheet.getCell('T2');
    bridgeTravelHead.value = 'TRAVELLING';
    bridgeTravelHead.note = '주행 (Bridge Travel)';

    sheet.mergeCells('AA2:AG2');
    const mainHoistHead = sheet.getCell('AA2');
    mainHoistHead.value = 'MAIN HOIST';
    mainHoistHead.note = '주권';

    sheet.mergeCells('AH2:AN2');
    const auxHoistHead = sheet.getCell('AH2');
    auxHoistHead.value = 'AUX HOIST';
    auxHoistHead.note = '보권';

    sheet.mergeCells('AO2:BL2');
    sheet.getCell('AO2').value = 'OPTION';

    sheet.getCell('BM2').value = '';

    sheet.addRow(columnArr.map(column => column.header));

    sheet.getCell('A3').note = 'TT:MM:SS';
    sheet.getCell('B3').note = '송신기 ID (10진수)';
    sheet.getCell('C3').note = '송신기 On/Off 신호';
    sheet.getCell('D3').note = '비상 정지(emergency stop) 2';
    sheet.getCell('F3').note = '조작 전원';
    sheet.getCell('G3').note = '경보';
    sheet.getCell('H3').note = '조명';

    // header style
    sheet.eachRow(row => {
      row.eachCell(cell => {
        cell.alignment = { vertical: 'middle', horizontal: 'center' };
    
        let boderBottomStyle: BorderStyle = 'hair';
        if (cell.fullAddress.row == 3) {
          boderBottomStyle = 'double';
        }
    
        cell.border = {
          top: { style: 'hair' },
          left: { style: 'thin' },
          bottom: { style: boderBottomStyle },
          right: { style: 'thin' }
        };

        cell.font = { bold: true };
        
        let argb: string;
        if (cell.fullAddress.col == 1) {
          argb = this.Color.header_timestamp;
        } else if (cell.fullAddress.col < 9) {
          argb = this.Color.header_basic;
        } else if (cell.fullAddress.col < 13) {
          argb = this.Color.header_aux;
        } else if (cell.fullAddress.col < 41) {
          argb = this.Color.header_travel_hoist;
        } else if (cell.fullAddress.col < 65) {
          argb = this.Color.header_sp;
        } else if (cell.fullAddress.col == 65) {
          argb = this.Color.header_basic
        } else {
          argb = '';
        }
    
        if (argb != '') {
          cell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb },
          };
        }
      });
    });
    
    sheet.getRow(3).commit();

    return sheet;
  }

}

type RowDataKey = keyof LogBody
| 'timestamp'
| 'ar20Onoff'
| 'trollyTravel_F'
| 'trollyTravel_B'
| 'trollyTravel_1'
| 'trollyTravel_2'
| 'trollyTravel_3'
| 'trollyTravel_4'
| 'bridgeTravel_L'
| 'bridgeTravel_R'
| 'bridgeTravel_1'
| 'bridgeTravel_2'
| 'bridgeTravel_3'
| 'bridgeTravel_4'
| 'mainHoist_U'
| 'mainHoist_D'
| 'mainHoist_1'
| 'mainHoist_2'
| 'mainHoist_3'
| 'mainHoist_4'
| 'auxHoist_U'
| 'auxHoist_D'
| 'auxHoist_1'
| 'auxHoist_2'
| 'auxHoist_3'
| 'auxHoist_4';