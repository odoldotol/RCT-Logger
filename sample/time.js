// 시간을 Uint8Array 에 저장하고 다시 읽기
// 이 앱이 아무리 오래 실행되어도 getTime 으로 얻은 시간(BigInt)이 48bit 를 넘어갈 일이 없음.
// 그래서 시간(BigInt)의 48bit 까지만 다룰것임.

let time = new Date();
console.log(time);

time = time.getTime(); // 밀리초 단위의 Unix 타임스탬프
console.log(time);

time = BigInt(time);
console.log(time);

const uint8Array = new Uint8Array(6); // 48비트, 6바이트

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
