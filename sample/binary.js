const fsP = require('fs/promises');
const fs = require('fs');
const path = 'bitdata.dat';

/**
 * 주어진 Buffer (각 바이트가 0 또는 1로 구성됨)을 하나의 바이트로 패킹하는 함수
 * @param {Buffer} bitBuffer - 예: Buffer.allocUnsafe(8) 안에 [1,0,1,0,1,0,1,0]
 * @returns {Buffer} - 1바이트 Buffer (패킹된 데이터)
 */
function packBufferBits(bitBuffer) {
  if (bitBuffer.byteLength % 8 !== 0) {
    throw new Error(`bitBuffer.byteLength(${bitBuffer.byteLength})는 8의 배수여야 합니다.`);
  }
  
  const byteCount = bitBuffer.byteLength / 8;
  const packedBuffer = Buffer.allocUnsafe(byteCount);
  
  for (let i = 0; i < byteCount; i++) {
    let byte = 0;
    for (let j = 0; j < 8; j++) {
      // bitBuffer[i*8+j]가 0 또는 1임을 가정하고 왼쪽으로 시프트 후 OR 연산
      byte = (byte << 1) | (bitBuffer[i * 8 + j] & 1);
    }
    packedBuffer[i] = byte;
  }
  
  return packedBuffer;
}

/**
 * 패킹된 Buffer(1바이트)를 받아서 언패킹하여 각 비트를 0 또는 1로 표현한 Buffer (8바이트)로 변환하는 함수
 * @param {Buffer} packedBuffer - 1바이트짜리 Buffer
 * @returns {Buffer} - 8바이트짜리 Buffer, 각 바이트가 0 또는 1로 표현됨
 */
function unpackBufferBits(packedBuffer) {
  const bitBuffer = Buffer.allocUnsafe(packedBuffer.byteLength * 8);
  
  for (let i = 0; i < packedBuffer.byteLength; i++) {
    let byte = packedBuffer[i];
    // 상위 비트부터 하나씩 추출하여 bitBuffer에 저장
    for (let j = 7; j >= 0; j--) {
      bitBuffer[i * 8 + (7 - j)] = (byte >> j) & 1;
    }
  }
  
  return bitBuffer;
}

// 예제: 8비트 데이터를 담은 Buffer 생성
const exampleBits = [1, 0, 1, 0, 0, 0, 0, 1, 1, 1, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 0, 0, 0, 1, 1, 1, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 0, 0, 0, 1, 1, 1, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 0, 0, 0, 1, 1, 1, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 0, 0, 0, 1, 1, 1, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 0, 0, 0, 1, 1, 1, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 0, 0, 0, 1, 1, 1, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 0, 0, 0, 1, 1, 1, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 0, 0, 0, 1, 1, 1, 1, 0, 1, 0, 1, 0];
const inputBitBuffer = Buffer.allocUnsafe(exampleBits.length);
// 입력 Buffer에 예제 비트 배열 복사
for (let i = 0; i < inputBitBuffer.byteLength; i++) {
  inputBitBuffer[i] = exampleBits[i];
}

console.log("Input Bit Buffer:", inputBitBuffer); // 각 바이트에 1, 0 등

// 1. 비트 Buffer를 1바이트 Buffer로 패킹
const packedBuffer = packBufferBits(inputBitBuffer);
console.log("Packed Buffer:", packedBuffer);

// 2. Packed Buffer를 파일로 저장 (동기 방식)
const a = fsP.appendFile(path, packedBuffer, {
  flush: true
});

console.log(`Data written to ${path}`);

a.then(() => {
// 3. 파일에서 Packed Buffer를 읽기
const readPackedBuffer = fs.readFileSync(path);
console.log("Read Packed Buffer:", readPackedBuffer);

// 4. 읽은 Packed Buffer를 다시 8비트 Buffer로 언패킹
const unpackedBitBuffer = unpackBufferBits(readPackedBuffer);
console.log("Unpacked Bit Buffer:", unpackedBitBuffer);

// 출력 확인: 언패킹한 결과가 원래 입력과 동일해야 함.

});

fsP.readdir('./').then((dir) => {
  console.log('Directory:', dir);
});

fs.createReadStream(path)
  .on('data', (chunk) => {
    console.log(`Received ${chunk.length} bytes of data.`);
  })
  .on('end', () => {
    console.log('There will be no more data.');
  });