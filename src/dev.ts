import * as X from "rxjs";

const serialStream = new X.Subject();

const repo = {
  write: async (data: any) => {
    console.log(data);
  }
};

const processor = {
  process: (data: any) => {
    return data;
  }
};

serialStream.pipe(
  X.bufferTime(1000),
  X.map(processor.process),
).subscribe(repo.write)
.unsubscribe();

import { SerialPort } from 'serialport';

// UART 포트 설정
const port = new SerialPort({
  path: '/dev/serial0',
  baudRate: 1200,
  autoOpen: true,
  highWaterMark: 512,
});

// 데이터 수신 (버퍼 처리)
port.on('data', (data: Buffer) => {
  console.log('Raw Binary Data:', data);

  // 바이너리 데이터를 처리하는 로직 추가
  const binaryString = data.toString('binary'); // 바이너리 문자열 변환
  console.log('Binary String:', binaryString);

  serialStream.next(binaryString);
});

// 에러 핸들링
port.on('error', (err) => {
  console.error('Error:', err.message);

  serialStream.error(err);
});





const findSyncIdx = (arr: (0 | 1)[]) => {
  let equal: 0 | 1 = 1;
  let lowLength = 28;
  let highLength = 2;

  const init = () => {
    equal = 1;
    lowLength = 28;
    highLength = 2;
  };

  for (let i = 0; i < arr.length; i++) {

    if (arr[i] === equal) {

      if (equal === 0) {
        lowLength--;
      } else if (lowLength === 0) {
        if (highLength === 0) {
          return i-31;
        }
        highLength--;
      }

      if (lowLength !== 0) {
        equal = 0;
      } else {
        equal = 1;
      }

    } else {
      init();
    }
  }
};