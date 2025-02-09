const FsP = require('fs/promises');
const Fs = require('fs');
const Path = require('path');
const { Subject } = require('rxjs');

const segmentName = process.argv[2];

const readStream = Fs.createReadStream(Path.resolve('/tmp', segmentName + ".dat"));

const subject = new Subject();

let buffer = Buffer.alloc(0);
readStream
.on("data", chunk => {
  const value = [];
  buffer = Buffer.concat([buffer, chunk]);
  while (buffer.length >= 19) {
    const data = buffer.subarray(0, 19);
    buffer = buffer.subarray(19);
    value.push(unpack(data));
  }
  subject.next(value);
})
.on("end", () => {
  console.log("end");
})
.on("close", () => {
  subject.complete();
})
.on("error", error => {
  subject.error(error);
});

const unpack = (buffer) => {
  return Buffer.concat([
    getB6Timestamp(buffer),
    getB1Subject(buffer),
    unpackDataWord(getB12DataWord6(buffer)),
  ]);
};

const getB6Timestamp = (buffer) => {
  return buffer.subarray(0, 6);
};

const getB1Subject = (buffer) => {
  return buffer.subarray(6, 7)
};

const getB12DataWord6 = (buffer) => {
  return buffer.subarray(7);
};

const unpackDataWord = (buffer) => {
  const result = Buffer.allocUnsafe(buffer.byteLength * 8); // 96

  for (let i = 0; i < buffer.byteLength; i++) {
    let byte = buffer[i];
    // 상위 비트부터 하나씩 추출하여 bitBuffer에 저장
    for (let j = 7; j >= 0; j--) {
      result[i * 8 + (7 - j)] = (byte >> j) & 1;
    }
  }
  
  return result;
};

subject.subscribe({
  next: (value) => { // Buffer<ArrayBuffer>[]
    value.forEach((buffer) => {
      const timestamp = unpackB6Timestamp(buffer.subarray(0, 6));
      const subject = buffer.subarray(6, 7).join('');
      console.log(`time: ${timestamp}`);
      console.log(`subject: ${subject}`);
      console.log(buffer.subarray(7, 23).join(''));
      console.log(buffer.subarray(23, 39).join(''));
      console.log(buffer.subarray(39, 55).join(''));
      console.log(buffer.subarray(55, 71).join(''));
      console.log(buffer.subarray(71, 87).join(''));
      console.log(buffer.subarray(87, 103).join(''));
    });
  },
  error: error => {
    console.error(error);
  },
  complete: () => {
    console.log("complete");
  }
});

const unpackB6Timestamp = (buffer) => {
  return new Date(unpackUTCMsB6Timestamp(buffer));
};

const unpackUTCMsB6Timestamp = (buffer) => {

  let time = 0;
  for (let i = 0; i < 6; i++) {
    time = time * 256 + buffer[i];
  }

  return time;
};