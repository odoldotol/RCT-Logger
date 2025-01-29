const Gpio = require('pigpio').Gpio;

const clk = new Gpio(11, {
  mode: Gpio.INPUT,
  pullUpDown: Gpio.PUD_DOWN,
});

const serial = new Gpio(10, {
  mode: Gpio.INPUT,
  pullUpDown: Gpio.PUD_DOWN,
});

const led = new Gpio(18, {
  mode: Gpio.OUTPUT,
  pullUpDown: Gpio.PUD_DOWN,
});

led.digitalWrite(0);

const wordLength = 32;
let syncWordCnt = 1;
let syncronized = false;
let cycleBufferIdx = 0;

const cycleBuffer = new Uint8Array(4096);

clk.glitchFilter(20);

clk.on('alert', level => {
  if (level == 1) {
    a();
  }
});




clk.enableAlert();


function a() {
  const level = serial.digitalRead();
  const isSyncWord = findSyncWord(level);
  if (
    !isSyncWord &&
    syncronized
  ) {
    addBuffer(level);
  } else if (
    isSyncWord &&
    syncronized
  ) {
    console.log('cycleBufferIdx', cycleBufferIdx);
    console.log(cycleBuffer.slice(cycleBufferIdx-31, cycleBufferIdx).join('') + "1");
    console.log("---");
    console.log(cycleBuffer.slice(cycleBufferIdx-223, cycleBufferIdx-191).join(''));
    console.log(cycleBuffer.slice(cycleBufferIdx-191, cycleBufferIdx-159).join(''));
    console.log(cycleBuffer.slice(cycleBufferIdx-159, cycleBufferIdx-127).join(''));
    console.log(cycleBuffer.slice(cycleBufferIdx-127, cycleBufferIdx-95).join(''));
    console.log(cycleBuffer.slice(cycleBufferIdx-95, cycleBufferIdx-63).join(''));
    console.log(cycleBuffer.slice(cycleBufferIdx-63, cycleBufferIdx-31).join(''));
    console.log("---");

    if (223 < cycleBufferIdx) {
      while (223 < cycleBufferIdx) {
        cycleBufferIdx = cycleBufferIdx - 224;
        console.log(cycleBuffer.slice(cycleBufferIdx-32, cycleBufferIdx).join(''));
        console.log("---");
        console.log(cycleBuffer.slice(cycleBufferIdx-223, cycleBufferIdx-191).join(''));
        console.log(cycleBuffer.slice(cycleBufferIdx-191, cycleBufferIdx-159).join(''));
        console.log(cycleBuffer.slice(cycleBufferIdx-159, cycleBufferIdx-127).join(''));
        console.log(cycleBuffer.slice(cycleBufferIdx-127, cycleBufferIdx-95).join(''));
        console.log(cycleBuffer.slice(cycleBufferIdx-95, cycleBufferIdx-63).join(''));
        console.log(cycleBuffer.slice(cycleBufferIdx-63, cycleBufferIdx-31).join(''));
        console.log("---");
      }
    }
    // console.log(1, cycleBuffer.slice(0, 32).join(''));
    // console.log(2, cycleBuffer.slice(32, 64).join(''));
    // console.log(3, cycleBuffer.slice(64, 96).join(''));
    // console.log(4, cycleBuffer.slice(96, 128).join(''));
    // console.log(5, cycleBuffer.slice(128, 160).join(''));
    // console.log(6, cycleBuffer.slice(160, 192).join(''));
    // console.log(7, cycleBuffer.slice(192, 224).join(''));
    // console.log(8, cycleBuffer.slice(224, 256).join(''));

    cycleBufferIdx = 0;
  } else if (
    isSyncWord &&
    !syncronized
  ) {
    syncronized = true;
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
