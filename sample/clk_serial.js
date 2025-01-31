const os = require('os');
os.setPriority(-20);

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


let test_clk_cnt = 0;

onoffSclk.watch((err, value) => {
  if (err) {
    // process.stderr.write(`sclk.watch error: ${err}\n`);
    console.error(`sclk.watch error: ${err}`);
    return;
  }

  if (value === 1) {
    // console.timeEnd("rising");
    // console.time("rising");
    test_clk_cnt++;
    console.time("process");
    // processSerial();
    a()
    console.timeEnd("process");
  } else {
    // Must Not Reach Here
    // process.stderr.write('sclk falling edge error\n');
    console.error('sclk falling edge error');
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

setTimeout(() => {
  onoffSclk.setEdge('rising');
}, 1000);

setTimeout(() => {
  onoffSclk.setEdge('none');
  syncWordCnt = 1;
  syncronized = false;
  cycleBufferIdx = 0;
}, 30000);

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
    if (test_clk_cnt !== 224) {
      console.log("!!!!!!!!!! test_clk_cnt !!!!!!!!!!!!!!", test_clk_cnt);
    }
    test_clk_cnt = 0;

    cycleBufferIdx = 0;
    // console.log('cycleBufferIdx', cycleBufferIdx);
    // console.log(cycleBuffer.slice(cycleBufferIdx-31, cycleBufferIdx).join('') + "1");
    // process.stdout.write(cycleBuffer.slice(0, 223));
    // console.log(cycleBuffer.slice(0, 192));
    // console.log((() => {
    //   let str = "";
    //   for (let i = 0; i < 192; i++) {
    //     str += cycleBuffer[i];
    //     if (i === 31 || i === 63 || i === 95 || i === 127 || i === 159) {
    //       str += "\n";
    //     }
    //   }
    //   return str;
    // })());
    // console.log((() => {
    //   const bf = [];
    //   for (let i = 0; i < 192; i++) {
    //     bf[i] = cycleBuffer[i];
    //   }
    //   return bf;
    // })());
    // console.log(cycleBuffer);
    // process.stdout.write("11111");
  } else if (
    isSyncWord &&
    !syncronized
  ) {
    test_clk_cnt = 0;

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

function a() {
  if (findSyncWord(serial.digitalRead())) {
    // console.log("test_clk_cnt", test_clk_cnt);
    test_clk_cnt = 0;
  } else {
    // console.log("sdjfdkgjfdkjgfkjkfjfdkljnfd");
  }
}
