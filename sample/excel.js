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
  { key: "deviceAddress", width: 7, header: 'ID' },
  { key: 'Ar20Onoff', width: 8, header: 'On/Off' },

  // OP
  { key: "opA", width: 6, header: 'A' },
  { key: "opB", width: 6, header: 'B' },

  { key: "startOn", width: 10, header: 'Start On' },

  { key: "siren", width: 8, header: 'Siren' },
  { key: "light", width: 8, header: 'Light' },

  { key: "aux1", width: 5, header: '1' },
  { key: "aux2", width: 5, header: '2' },
  { key: "aux3", width: 5, header: '3' },
  { key: "aux4", width: 5, header: '4' },

  // trollyTravel 횡행 7행
  { key: "trollyTravel", width: 7, header: '' },
  { key: "trollyTravel_F", width: 5, header: 'F' },
  { key: "trollyTravel_B", width: 5, header: 'B' },
  { key: "trollyTravel_1", width: 5, header: '1' },
  { key: "trollyTravel_2", width: 5, header: '2' },
  { key: "trollyTravel_3", width: 5, header: '3' },
  { key: "trollyTravel_4", width: 5, header: '4' },

  // bridgeTravel 주행 7행
  { key: "bridgeTravel", width: 7, header: '' },
  { key: "bridgeTravel_L", width: 5, header: 'L' },
  { key: "bridgeTravel_R", width: 5, header: 'R' },
  { key: "bridgeTravel_1", width: 5, header: '1' },
  { key: "bridgeTravel_2", width: 5, header: '2' },
  { key: "bridgeTravel_3", width: 5, header: '3' },
  { key: "bridgeTravel_4", width: 5, header: '4' },

  // mainHoist Main 7행
  { key: "mainHoist", width: 7, header: '' },
  { key: "mainHoist_U", width: 5, header: 'U' },
  { key: "mainHoist_D", width: 5, header: 'D' },
  { key: "mainHoist_1", width: 5, header: '1' },
  { key: "mainHoist_2", width: 5, header: '2' },
  { key: "mainHoist_3", width: 5, header: '3' },
  { key: "mainHoist_4", width: 5, header: '4' },

  // auxHoist Aux 7행
  { key: "auxHoist", width: 7, header: '' },
  { key: "auxHoist_U", width: 5, header: 'U' },
  { key: "auxHoist_D", width: 5, header: 'D' },
  { key: "auxHoist_1", width: 5, header: '1' },
  { key: "auxHoist_2", width: 5, header: '2' },
  { key: "auxHoist_3", width: 5, header: '3' },
  { key: "auxHoist_4", width: 5, header: '4' },

  // SP
  { key: "sp1", width: 5, header: '1' },
  { key: "sp2", width: 5, header: '2' },
  { key: "sp3", width: 5, header: '3' },
  { key: "sp4", width: 5, header: '4' },
  { key: "sp5", width: 5, header: '5' },
  { key: "sp6", width: 5, header: '6' },
  { key: "sp7", width: 5, header: '7' },
  { key: "sp8", width: 5, header: '8' },
  { key: "sp9", width: 5, header: '9' },
  { key: "sp10", width: 5, header: '10' },
  { key: "sp11", width: 5, header: '11' },
  { key: "sp12", width: 5, header: '12' },

  { key: "sp13", width: 5, header: '13' },
  { key: "sp14", width: 5, header: '14' },
  { key: "sp15", width: 5, header: '15' },
  { key: "sp16", width: 5, header: '16' },
  { key: "sp17", width: 5, header: '17' },
  { key: "sp18", width: 5, header: '18' },
  { key: "sp19", width: 5, header: '19' },
  { key: "sp20", width: 5, header: '20' },
  { key: "sp21", width: 5, header: '21' },
  { key: "sp22", width: 5, header: '22' },
  { key: "sp23", width: 5, header: '23' },
  { key: "sp24", width: 5, header: '24' },

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
sheet1.getCell('B2').value = 'TX';

sheet1.mergeCells('D2:E2');
sheet1.getCell('D2').value = 'OP';

sheet1.getCell('F2').value = '';

sheet1.mergeCells('G2:H2'); // siren, light
sheet1.mergeCells('I2:L2'); // aux1-4
sheet1.getCell('I2').value = 'Aux';

sheet1.mergeCells('M2:S2');
sheet1.getCell('M2').value = 'Trolly Travel';

sheet1.mergeCells('T2:Z2');
sheet1.getCell('T2').value = 'Bridge Travel';

sheet1.mergeCells('AA2:AG2');
sheet1.getCell('AA2').value = 'Main Hoist';

sheet1.mergeCells('AH2:AN2');
sheet1.getCell('AH2').value = 'Aux Hoist';

sheet1.mergeCells('AO2:BL2');
sheet1.getCell('AO2').value = 'SP';

sheet1.getCell('BM2').value = '';

sheet1.addRow(columnArr.map(column => column.header));

sheet1.getCell('A3').note = 'TT:MM:SS';
sheet1.getCell('B3').note = '송신기 ID (10진수)';
sheet1.getCell('C3').note = '송신기 On/Off 신호';

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

sheet1.addRow({
  timestamp: '10:56:34',
  Ar20Onoff: 'ON',
});

sheet1.addRow({
  timestamp: '10:56:35',
  deviceAddress: '1',
  startOn: 'ON',
});

sheet1.commit();

streamWorkbook.commit();