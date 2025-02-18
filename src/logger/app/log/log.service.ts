import { createWriteStream } from "fs";
import * as Path from "path";
import ExcelJS from "exceljs";
import { B103ExtractedData, SubjectValue } from "../../../common";
import { LogRepository } from "../../../logger/database";
import * as X from "rxjs/operators";
import { Log, LogFactory } from "./log.factory";

export class LogService {

  constructor(
    private readonly logFactory: LogFactory,
    private readonly logRepository: LogRepository
  ) {}

  public log(dataBuffer: B103ExtractedData) {
    this.logRepository.create(dataBuffer);
  }

  public fakeDownload(writeDir: string) {
    return new Promise<void>(async (resolve, reject) => {
      // 쓰기 스트림 만들고
      const now = new Date();
      const fileName = `download_${now.toLocaleDateString("en-GB", { timeZone: "Asia/Seoul" }).split("/").reverse().join("-")}_${now.toLocaleTimeString("en-GB", { timeZone: "Asia/Seoul" }).replace(/:/g, "-")}.xlsx`;
      const writePath = Path.resolve(writeDir, fileName);
      const writeStream = createWriteStream(writePath)
      .on("finish", resolve)
      .on("error", reject);

      // 엑셀 워크북 쓰기 스트림 만들고
      const streamWorkbook = new ExcelJS.stream.xlsx.WorkbookWriter({
        stream: writeStream,
        // useStyles: true,
      });
      streamWorkbook.creator = 'Lygorithm from RCT.';
      streamWorkbook.created = now;
      // 5일치 세그먼트이름 가져와서
      const segmentNameArr = await this.logRepository.getLastSegmentName();
      // 하나씩
      for (const segmentName of segmentNameArr) {
        // 읽기스트림 요청
        const logStream = await this.logRepository.readSegment(segmentName);
        // 엑셀 시트 구성
        const sheet = streamWorkbook.addWorksheet(segmentName, { views: [ { state: 'frozen', xSplit: 6, ySplit:2 } ] });

        sheet.columns = [
          { key: 'timestamp', width: 17 },
          { key: 'Ar20Onoff', width: 10 },
          { key: "deviceAddress", width: 10 },
          { key: "startOff", width: 10 },
          { key: "startOn", width: 10 },
          { key: "MCAData", width: 10 },
        
          { key: "opA", width: 10 },
          { key: "opB", width: 10 },
          { key: "siren", width: 10 },
          { key: "light", width: 10 },
          { key: "trollyTravel", width: 10 },
          { key: "bridgeTravel", width: 10 },
          { key: "mainHoist", width: 10 },
          { key: "auxHoist", width: 10 },
          { key: "aux1", width: 10 },
          { key: "aux2", width: 10 },
          { key: "aux3", width: 10 },
          { key: "aux4", width: 10 },
          { key: "sp1", width: 10 },
          { key: "sp2", width: 10 },
          { key: "sp3", width: 10 },
          { key: "sp4", width: 10 },
          { key: "sp5", width: 10 },
          { key: "sp6", width: 10 },
          { key: "sp7", width: 10 },
          { key: "sp8", width: 10 },
          { key: "sp9", width: 10 },
          { key: "sp10", width: 10 },
          { key: "sp11", width: 10 },
          { key: "sp12", width: 10 },
          { key: "sp13", width: 10 },
          { key: "sp14", width: 10 },
          { key: "sp15", width: 10 },
          { key: "sp16", width: 10 },
          { key: "sp17", width: 10 },
          { key: "sp18", width: 10 },
          { key: "sp19", width: 10 },
          { key: "sp20", width: 10 },
          { key: "sp21", width: 10 },
          { key: "sp22", width: 10 },
          { key: "sp23", width: 10 },
          { key: "sp24", width: 10 },
        ];
        
        sheet.mergeCells('A1:C1');
        sheet.mergeCells('D1:F1');
        sheet.mergeCells('G1:J1');
        sheet.mergeCells('K1:N1');
        sheet.getCell('D1').value = 'F';

        sheet.addRow([
          'Timestamp',
          'Ar20 On/Off',
          'Device Address',
          'Start Off',
          'Start On',
          'MCA Data',
        
          'Op A',
          'Op B',
          'Siren',
          'Light',
          'Trolly Travel',
          'Bridge Travel',
          'Main Hoist',
          'Aux Hoist',
          'Aux 1',
          'Aux 2',
          'Aux 3',
          'Aux 4',
          'SP 1',
          'SP 2',
          'SP 3',
          'SP 4',
          'SP 5',
          'SP 6',
          'SP 7',
          'SP 8',
          'SP 9',
          'SP 10',
          'SP 11',
          'SP 12',
          'SP 13',
          'SP 14',
          'SP 15',
          'SP 16',
          'SP 17',
          'SP 18',
          'SP 19',
          'SP 20',
          'SP 21',
          'SP 22',
          'SP 23',
          'SP 24',
        ]);

        sheet.getCell('B2').note = '송신기의 On/Off 상태';
        sheet.getRow(2).commit();

        // 읽은 데이터로 엑셀 Row 커밋
        await new Promise<void>((resolve, reject) => {

          let secTime = 0;
          const secLogArr: Log[] = [];

          logStream.pipe(
            // 객체로 변환
            X.map(dataArr => dataArr.map(data => this.logFactory.create(data))),
          ).subscribe({
            next: (logArr) => {
              // 1초단위로 압축 (압축없이 보여줘야하는것은 보여주고)
              logArr.forEach(log => {

                if (log.header.subject == SubjectValue.Data) {

                  const secTimeTemp = Math.floor(log.header.timestamp / 1000) * 1000
                  if (secTime == secTimeTemp) {
                    secLogArr.push(log);
                  } else {
                    // 압축,평균 해서 로깅해야하는데 임시로 그냥 하나 로깅함.
                    // 압축할때 startonoff 는 항상 살려.
                    const logToAdd = secLogArr[0];
                    if (logToAdd) {
                      sheet.addRow({
                        timestamp: new Date(secTime).toLocaleTimeString("en-GB", { timeZone: "Asia/Seoul" }),
                        ...logToAdd.body,
                      });
                    }

                    secTime = secTimeTemp;
                    secLogArr.length = 0;
                    secLogArr.push(log);
                  }

                } else {

                  sheet.addRow({
                    timestamp: new Date(log.header.timestamp).toLocaleTimeString("en-GB", { timeZone: "Asia/Seoul" }),
                    Ar20Onoff: log.header.subject
                  });

                }

              });

              sheet.lastRow?.commit();
            },
            complete: resolve,
            error: reject,
          });
        });
        // 다 읽으면 엑셀시트 완성
        sheet.commit();
      }
      // 엑셀 워크북 커밋
      streamWorkbook.commit();
      // 완료
    });
  }

}
