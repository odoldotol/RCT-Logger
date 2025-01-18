import { SerialPort } from 'serialport';
import { ByteLengthParser } from '@serialport/parser-byte-length';
import * as X from 'rxjs';

// 시리얼 포트 설정
const port = new SerialPort({
  path: '/dev/serial0',
  baudRate: 1200,    // 1200bps 설정
  dataBits: 8,       // 데이터 비트
  stopBits: 1,       // 스톱 비트
  parity: 'none',    // 패리티 없음
  autoOpen: false,   // 자동으로 포트 열기 비활성화
  lock: true,        // 잠금 활성화
  rtscts: false,     // 하드웨어 흐름 제어 비활성화
});

SerialPort.list().then((ports) => {})

port.open()

// ByteLength 파서를 사용해 4바이트(32bit)씩 데이터 분리
const parser = port.pipe(new ByteLengthParser({ length: 4 }));

const obx: X.Observable<any> = X.fromEvent(parser, 'data');

obx.pipe(
  X.filter(isValid),
  X.map(processBinaryData),
).subscribe({
  next: (data) => console.log('Data:', data),
  error: (err) => console.error('Error:', err),
  complete: () => console.log('Completed'),
});

// 바이너리 데이터 처리 함수
function processBinaryData(buffer: Buffer) {
  // 예: 2진수로 변환
  const binaryString = buffer.toString('binary');
  console.log('Binary:', binaryString);

  // 데이터 반전 예제 (8비트 단위)
  const reversed = buffer.map(byte => parseInt(byte.toString(2).padStart(8, '0').split('').reverse().join(''), 2));
  console.log('Reversed:', reversed);
}

function isValid(buffer: Buffer) {
  return isSymmetric(buffer)
  && isStartValid(buffer)
  && isEndValid(buffer);
}

/**
 * 좌우 대칭인지? 예시
 */
function isSymmetric(buffer: Buffer) {
  let pointerInc = 0;
  let pointerDec = buffer.length - 1;
  while (pointerInc < pointerDec) {
    if (buffer[pointerInc++] !== buffer[pointerDec--]) {
      return false;
    }
  }
  return true;
}

/**
 * 시작 코드 검증. 예시
 */
function isStartValid(buffer: Buffer) {
  return buffer[0] === 0x55;
}

/**
 * 종료 코드 검증. 예시
 */
function isEndValid(buffer: Buffer) {
  return buffer[buffer.length - 1] === 0xAA;
}

port.on('open', () => {
  console.log('Serial port is opened');
});

port.on('close', () => {
  console.log('Serial port is closed');
});

port.on('error', (err) => {
  console.error('Error:', err);
});

// 시리얼 포트 닫기
process.on('SIGINT', () => {
  port.close((err) => {
    if (err) {
      console.error('Error:', err);
    }
    process.exit(0);
  });
});

// 포트 열기
port.open((err) => {
  if (err) {
    console.error('Error:', err);
  }
});

parser.on('open', () => {
  console.log('Parser is opened');
});

parser.on('close', () => {
  console.log('Parser is closed');
});

parser.on('error', (err) => {
  console.error('Error:', err);
});

parser.on('data', (data) => {
  console.log('Data:', data);
});

parser.on('drain', () => {
  console.log('Drain');
});