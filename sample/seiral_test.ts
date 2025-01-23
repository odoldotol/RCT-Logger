import { SerialPort } from 'serialport';
// import * as X from "rxjs";

// UART 포트 설정
const port = new SerialPort({
  path: '/dev/ttyAMA3',
  baudRate: 1200,    // 1200bps 설정
  dataBits: 8,       // 데이터 비트
  // stopBits: 1,       // 스톱 비트
  parity: 'none',    // 패리티 없음
  autoOpen: false,   // 자동으로 포트 열기 비활성화
  highWaterMark: 512,
  lock: true,        // 잠금 활성화
  rtscts: false,     // 하드웨어 흐름 제어 비활성화
});

SerialPort.list().then((ports) => {
  console.log('Available Ports:', ports);
});

port.on('open', () => {
  console.log('Serial port is opened');
});

port.on('close', () => {
  console.log('Serial port is closed');
});

port.open();

port.on('data', (data: Buffer) => {
  console.log('Raw Binary Data:', data);

  // const binaryString = data.toString('binary');
  // console.log('Binary String:', binaryString);

  // serialStream.next(binaryString);
});

port.on('error', (err) => {
  console.error('Error:', err.message);

  // serialStream.error(err);
});

// const serialStream = new X.Subject();

// const repo = {
//   write: async (data: any) => {
//     console.log(data);
//   }
// };

// const processor = {
//   process: (data: any) => {
//     return data;
//   }
// };

// serialStream.pipe(
//   X.bufferTime(1000),
//   X.map(processor.process),
// ).subscribe(repo.write)
// .unsubscribe();

process.on('SIGINT', () => {
  port.close((err) => {
    if (err) {
      console.error('CloseError:', err);
    }
    process.exit(0);
  });
  console.log('Serial port is closed');
});