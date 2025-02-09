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










// construct a streaming XLSX workbook writer with styles and shared strings
const streamWorkbook = new ExcelJS.stream.xlsx.WorkbookWriter({
  stream: fs.createWriteStream('./stream.xlsx'),
  // filename: './streamed-workbook.xlsx',
  useStyles: true,
  useSharedStrings: true
});

streamWorkbook.creator = 'Lygorithm from RCT.';
streamWorkbook.created = new Date();

const sheet1 = streamWorkbook.addWorksheet('sheet1', {views:[{state: 'frozen', xSplit: 3, ySplit:2}]});

sheet1.columns = [
  { key: 'timestamp', width: 17 },
  { key: 'txOnoff', width: 10 },
  { key: 'startOnoff', width: 10 },
  { key: 'r1', width: 5 },
  { key: 'r2', width: 5 },
  { key: 'r3', width: 5 },
  { key: 'r4', width: 5 },
];

sheet1.mergeCells('A1:C1');
sheet1.mergeCells('D1:G1');
sheet1.getCell('D1').value = 'F';
// sheet1.getRow(1).commit();

sheet1.addRow(['Timestamp', 'TxOnOff', 'StartOnOff', 'R1', 'R2', 'R3', 'R4']);
sheet1.getCell('B2').note = '송신기의 On/Off 상태';
sheet1.getRow(2).commit();


sheet1.addRow({timestamp: new Date(), txOnoff: 'ON', startOnoff: 'ON', r1: 'O', r2: 'O'});
sheet1.addRow({timestamp: new Date(), txOnoff: 'ON', startOnoff: 'ON', r1: 'O', r2: 'O', r3: 'O'});
sheet1.addRow({timestamp: new Date(), txOnoff: 'OFF', startOnoff: 'OFF'}).commit();

sheet1.commit();

streamWorkbook.commit();