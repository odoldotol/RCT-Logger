// 시간을 Uint8Array 에 저장하고 다시 읽기
// 이 앱이 아무리 오래 실행되어도 getTime 으로 얻은 시간(BigInt)이 48bit 를 넘어갈 일이 없음.
// 그래서 시간(BigInt)의 48bit 까지만 다룰것임.

let time = new Date();
console.log(time);

time = time.getTime(); // 밀리초 단위의 Unix 타임스탬프
console.log(time);

time = BigInt(time);
console.log(time);

const uint8Array = Buffer.allocUnsafe(6); // 48비트, 6바이트

// 상위 48비트만 6바이트에 저장
for (let i = 0; i < 6; i++) {
  uint8Array[i] = Number((time >> BigInt(8 * (5 - i))) & BigInt(0xFF));
}

console.log(uint8Array);

// restore
let restoreTime = BigInt(0);
for (let i = 0; i < 6; i++) {
  restoreTime = (restoreTime << BigInt(8)) | BigInt(uint8Array[i]);
}

console.log(restoreTime);  // 밀리초 단위의 Unix 타임스탬프

restoreTime = Number(restoreTime);
console.log(restoreTime);

restoreTime = new Date(restoreTime);
console.log(restoreTime);

console.log("--------------------");

const getTimeBuffer = (date) => {
  // 현재 시간을 밀리초 단위의 number로 가져옴
  const time = date.getTime();
  // 6바이트 Buffer 생성 (48비트)
  const buffer = Buffer.allocUnsafe(6);

  let t = time;
  // 낮은 순서의 바이트부터 채워서, 이후 상위 바이트로 옮겨감.
  // 원하는 방식에 따라 바이트 순서를 바꿀 수 있음.
  for (let i = 5; i >= 0; i--) {
    buffer[i] = t & 0xFF;          // 현재 t의 최하위 8비트를 저장
    t = Math.floor(t / 256);         // t를 8비트(1바이트) 제거
  }

  return buffer;
};

const restoreTimeBuffer = (buffer) => {
  let time = 0;
  // 6바이트를 순차적으로 읽어 48비트 정수로 복원 (상위 바이트부터 읽음)
  for (let i = 0; i < 6; i++) {
    time = time * 256 + buffer[i];
  }
  return new Date(time);
};

const now = new Date();
console.log(now);
const timeBuffer = getTimeBuffer(now);
console.log(timeBuffer);
console.log(restoreTimeBuffer(timeBuffer));
