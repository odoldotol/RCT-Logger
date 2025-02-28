const ExcelJS = require('exceljs');
const fs = require('fs');

// const now = new Date();
// const fileName = `download_${now.toLocaleDateString("en-GB", { timeZone: "Asia/Seoul" }).split("/").reverse().join("-")}_${now.toLocaleTimeString("en-GB", { timeZone: "Asia/Seoul" })}.xlsx`;

// construct a streaming XLSX workbook writer with styles and shared strings
const streamWorkbook = new ExcelJS.stream.xlsx.WorkbookWriter({
  stream: fs.createWriteStream(`./stream.xlsx`),
  // stream: fs.createWriteStream(`./${fileName}`),
  // filename: './streamed-workbook.xlsx',
  useStyles: true,
  // useSharedStrings: true
});

const segmentName = '25_01_25';

streamWorkbook.creator = 'Lygorithm from RCT.';
streamWorkbook.created = new Date();

const sheet1 = streamWorkbook.addWorksheet(segmentName, {
  views: [ { state: 'frozen', xSplit: 8, ySplit: 3 } ]
});

const columnArr = [
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

sheet1.columns = columnArr.map(column => {
  const { header, ...rest } = column;
  return rest;
});

sheet1.getCell('A1').value = '';
sheet1.getRow(1).commit();

sheet1.getCell('A2').value = segmentName;

sheet1.mergeCells('B2:C2');
sheet1.getCell('B2').value = 'TRANSMITTER';

sheet1.mergeCells('D2:H2');
sheet1.getCell('D2').value = 'POWER';

sheet1.mergeCells('I2:L2'); // aux1-4
sheet1.getCell('I2').value = 'AUX';

sheet1.mergeCells('M2:S2');
const trollyTravelHead = sheet1.getCell('M2');
trollyTravelHead.value = 'TRAVERSING';
trollyTravelHead.note = '횡행 (Trolly Travel)';

sheet1.mergeCells('T2:Z2');
const bridgeTravelHead = sheet1.getCell('T2');
bridgeTravelHead.value = 'TRAVELLING';
bridgeTravelHead.note = '주행 (Bridge Travel)';

sheet1.mergeCells('AA2:AG2');
const mainHoistHead = sheet1.getCell('AA2');
mainHoistHead.value = 'MAIN HOIST';
mainHoistHead.note = '주권';

sheet1.mergeCells('AH2:AN2');
const auxHoistHead = sheet1.getCell('AH2');
auxHoistHead.value = 'AUX HOIST';
auxHoistHead.note = '보권';

sheet1.mergeCells('AO2:BL2');
sheet1.getCell('AO2').value = 'OPTION';

sheet1.getCell('BM2').value = '';

sheet1.addRow(columnArr.map(column => column.header));

sheet1.getCell('A3').note = 'TT:MM:SS';
sheet1.getCell('B3').note = '송신기 ID (10진수)';
sheet1.getCell('C3').note = '송신기 On/Off 신호';
sheet1.getCell('D3').note = '비상 정지(emergency stop) 2';
sheet1.getCell('F3').note = '조작 전원';
sheet1.getCell('G3').note = '경보';
sheet1.getCell('H3').note = '조명';

sheet1.eachRow(row => {
  row.eachCell(cell => {
    cell.alignment = { vertical: 'middle', horizontal: 'center' };

    let boderBottomStyle = 'hair';
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
    
    let argb;
    if (cell.fullAddress.col == 1) {
      argb = 'fcd5b4';
    } else if (cell.fullAddress.col < 9) {
      argb = 'd9d9d9';
    } else if (cell.fullAddress.col < 13) {
      argb = 'e6b8b7';
    } else if (cell.fullAddress.col < 41) {
      argb = 'da9694';
    } else if (cell.fullAddress.col < 65) {
      argb = 'c5d9f1';
    } else if (cell.fullAddress.col == 65) {
      argb = 'd9d9d9';
    }

    cell.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb },
    };
  });
});

sheet1.getRow(3).commit();

sheet1.commit();

streamWorkbook.commit();