const Gpio = require('pigpio').Gpio;

const spiClockPin = new Gpio(
  11,
  {
    mode: Gpio.INPUT,
    pullUpDown: Gpio.PUD_DOWN,
    edge: Gpio.RISING_EDGE
  }
);

console.time('interrupt');

spiClockPin.on('interrupt', (level) => {
  if (level === 1) {
    console.timeEnd('interrupt');
    console.time('interrupt');
  } else {
    // Must Not Reach Here
    console.log('Clock is falling edge');
  }
});

process.on('SIGINT', () => {
  spiClockPin.disableInterrupt();
  process.exit(0);
});