const PigPioGpio = require('pigpio').Gpio;

const clk = new PigPioGpio(11, {
  mode: PigPioGpio.INPUT,
  pullUpDown: PigPioGpio.PUD_DOWN,
});

const serial = new PigPioGpio(10, {
  mode: PigPioGpio.INPUT,
  pullUpDown: PigPioGpio.PUD_DOWN,
});

const led = new PigPioGpio(18, {
  mode: PigPioGpio.OUTPUT,
  pullUpDown: PigPioGpio.PUD_DOWN,
});

led.digitalWrite(0);

const wordLength = 32;
let syncWordCnt = 1;
let syncronized = false;
let cycleBufferIdx = 0;

const cycleBuffer = new Uint8Array(4096);

clk.glitchFilter(20);

console.time("sync");
let prev = 0;

clk.on('alert', (level, tick) => {
  if (level == 1) {
	  console.log(tick - prev);
    prev = tick;
    console.timeEnd("sync");
    console.time("sync");
  }
});

clk.enableAlert();

process.on('SIGINT', () => {
  clk.disableAlert();
  process.exit(0);
});


const OoffGpio = require('onoff').Gpio;

const onOffSclk = new OoffGpio(523, 'in', 'rising');
const onOffData = new OoffGpio(522, 'in');
const onOffReceiverStatus = new OoffGpio(534, 'in', 'both');

let buffer = [];

console.time('interrupt');

onOffSclk.watch((err, value) => {
  if (err) {
    throw err;
  }

  if (value === 1) {
    onOffData.read((err, value) => {
      if (err) {
        throw err;
      }
      buffer.push(`${value}`);
    });
    console.timeEnd('interrupt');
    console.time('interrupt');
  } else {
    // Must Not Reach Here
    console.error('Clock is falling edge');
  }
});