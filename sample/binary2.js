const theBuffer = Buffer.from([0, 1, 0, 1]);

console.log(theBuffer);

function bufferToNumber(buffer) {
  let result = 0;
  for (let i = 0; i < buffer.length; i++) {
    // 각 비트를 왼쪽으로 시프트하고, 현재 비트를 OR 연산으로 결합
    result = (result << 1) | buffer[i];
  }
  return result;
}

const numberValue = bufferToNumber(theBuffer);
console.log(numberValue);


const comBuffer = Buffer.from([0, 1, 0, 1]);

console.log(comBuffer.compare(theBuffer));

console.log(0b0010);
