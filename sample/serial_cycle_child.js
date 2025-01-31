const PigGpio = require('pigpio').Gpio;
const OoffGpio = require('onoff').Gpio;

const onoffSclk = new OoffGpio(523, 'in');
const serial = new PigGpio(10, {
  mode: PigGpio.INPUT,
  pullUpDown: PigGpio.PUD_DOWN,
});

process.on("SIGINT", () => {
  onoffSclk.unwatchAll();
  onoffSclk.unexport();
});

const cycleBuffer = new Uint8Array(256);

onoffSclk.watch((err, value) => {
  if (err) {
    process.stderr.write(`sclk.watch error: ${err}\n`);
    return;
  }

  if (value === 1) {
    // console.timeEnd("rising");
    // console.time("rising");
    processSerial();
  } else {
    // Must Not Reach Here
    process.stderr.write('sclk falling edge error\n');
  }
});

process.on("message", (msg) => {
  if (msg == 1) {
    // console.time("rising");
    onoffSclk.setEdge('rising');
  } else if (msg == 0) {
    // console.timeEnd("rising");
    onoffSclk.setEdge('none');
    syncWordCnt = 1;
    syncronized = false;
    cycleBufferIdx = 0;
  }
});

const wordLength = 32;
let syncWordCnt = 1;
let syncronized = false;
let cycleBufferIdx = 0;

function processSerial() {
  const level = serial.digitalRead();
  const isSyncWord = findSyncWord(level);
  if (
    !isSyncWord &&
    syncronized
  ) {
    // console.log('addBuffer', cycleBufferIdx, level);
    addBuffer(level);
  } else if (
    isSyncWord &&
    syncronized
  ) {
    cycleBufferIdx = 0;
    // console.log('cycleBufferIdx', cycleBufferIdx);
    // console.log(cycleBuffer.slice(cycleBufferIdx-31, cycleBufferIdx).join('') + "1");
    process.stdout.write(cycleBuffer.slice(0, 223));
    // console.log(cycleBuffer);
    // process.stdout.write("11111");
  } else if (
    isSyncWord &&
    !syncronized
  ) {
    syncronized = true;
    // console.log('syncronized');
  }
}

function findSyncWord(level) {

  if (syncWordCnt == 1) {
    level == 1 && syncWordCnt++;
  } else if (
    2 <= syncWordCnt &&
    syncWordCnt <= 30
  ) {
    level == 0 ? syncWordCnt++ : syncWordCnt = 2;
  } else if (syncWordCnt == 31) {
    level == 1 ? syncWordCnt++ : syncWordCnt = 1;
  } else if (syncWordCnt == 32) {
    syncWordCnt = 1;
    return level == 1;
  }

  return false;
}

function addBuffer(level) {
  cycleBuffer[cycleBufferIdx++] = level;
}