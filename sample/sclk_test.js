const pigpio = require('pigpio');
const Gpio = pigpio.Gpio;

let spiClockPin;

try {
  spiClockPin = new Gpio(
    11,
    {
      mode: Gpio.INPUT,
      pullUpDown: Gpio.PUD_DOWN,
    }
  );

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
    if (spiClockPin) {
      spiClockPin.disableInterrupt();
    }
    process.exit(0);
  });

  console.time('interrupt');
  spiClockPin.enableInterrupt(Gpio.RISING_EDGE); // Error
} catch (e) {
  console.error(e);
  if (spiClockPin) {
    spiClockPin.disableInterrupt();
  }
}