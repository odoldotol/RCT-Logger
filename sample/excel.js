const ExcelJS = require('exceljs');
const fs = require('fs');


const workbook = new ExcelJS.Workbook();

workbook.creator = 'Lygorithm from RCT.';
workbook.created = new Date();

const worksheet2025_01_01 = workbook.addWorksheet('2025_01_01');
const tabColor = workbook.addWorksheet('tabColor', {properties:{tabColor:{argb:'FFC0000'}}});
const frozen = workbook.addWorksheet('frozen', {views:[{state: 'frozen', xSplit: 1, ySplit:1}]});

frozen.columns = [
  { header: 'Id', key: 'id', width: 10 },
  { header: 'Name', key: 'name', width: 32 },
  { header: 'D.O.B.', key: 'dob', width: 10 }
];

frozen.addRow({id: 1, name: 'John Doe', dob: new Date(1970,1,1)});
frozen.addRow({id: 2, name: 'Jane Doe', dob: new Date(1965,1,7)});

const rows = [
  [5,'Bob',new Date()], // row by array
  {id:6, name: 'Barbara', dob: new Date()}
];

// Add an array of rows with inherited style
// These new rows will have same styles as last row
// and return them as array of row objects
const newRowsStyled = frozen.addRows(rows, 'i');




// plain text note
frozen.getCell('A1').note = 'Hello, ExcelJS!';


// write to a file
workbook.xlsx.writeFile("./test.xlsx");










const now = new Date();
const fileName = `download_${now.toLocaleDateString("en-GB", { timeZone: "Asia/Seoul" }).split("/").reverse().join("-")}_${now.toLocaleTimeString("en-GB", { timeZone: "Asia/Seoul" })}.xlsx`;

// construct a streaming XLSX workbook writer with styles and shared strings
const streamWorkbook = new ExcelJS.stream.xlsx.WorkbookWriter({
  stream: fs.createWriteStream(`./stream.xlsx`),
  // stream: fs.createWriteStream(`./${fileName}`),
  // filename: './streamed-workbook.xlsx',
  useStyles: true,
  useSharedStrings: true
});

streamWorkbook.creator = 'Lygorithm from RCT.';
streamWorkbook.created = new Date();

const sheet1 = streamWorkbook.addWorksheet('sheet1', {views:[{state: 'frozen', xSplit: 6, ySplit:2}]});

sheet1.columns = [
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

sheet1.mergeCells('A1:C1');
sheet1.mergeCells('D1:F1');
sheet1.mergeCells('G1:J1');
sheet1.mergeCells('K1:N1');
sheet1.getCell('D1').value = 'F';

sheet1.addRow([
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
sheet1.getCell('B2').note = '송신기의 On/Off 상태';
sheet1.getRow(2).commit();


// sheet1.addRow({timestamp: new Date(), txOnoff: 'ON', startOnoff: 'ON', r1: 'O', r2: 'O'});
// sheet1.addRow({timestamp: new Date(), txOnoff: 'ON', startOnoff: 'ON', r1: 'O', r2: 'O', r3: 'O'});
// sheet1.addRow({timestamp: new Date(), txOnoff: 'OFF', startOnoff: 'OFF'}).commit();

sheet1.commit();

streamWorkbook.commit();