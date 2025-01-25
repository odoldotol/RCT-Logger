// GPIO18 에 연결된 LED 3초간 켜고 끄기

const Gpio = require('pigpio').Gpio;

const led = new Gpio(
  18,
  {
    mode: Gpio.OUTPUT
  }
);

on();

setTimeout(() => {
  off();
}, 3000);

process.on('SIGINT', () => {
  off();
  process.exit(0);
});

function on() {
  led.digitalWrite(1);
  console.log('LED is on');
}

function off() {
  led.digitalWrite(0);
  console.log('LED is off');
  led.mode(Gpio.INPUT);
}
