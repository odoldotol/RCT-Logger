const pigpio = require('pigpio');
const Gpio = pigpio.Gpio;

const pin = new Gpio(11, { mode: Gpio.INPUT, pullUpDown: Gpio.PUD_DOWN });

setInterval(() => {
  console.log('GPIO 11 state:', pin.digitalRead());
}, 1000);

process.on('SIGINT', () => {
  pin.disableInterrupt();
  process.exit(0);
});

setTimeout(() => {
  try {
    pin.enableInterrupt(Gpio.RISING_EDGE);
    console.log('Interrupt enabled');
  } catch (error) {
    console.error('Failed to enable interrupt:', error.message);
  }
  pin.on('interrupt', (level) => {
    console.log('Interrupt detected:', level);
  });
}, 10000);
