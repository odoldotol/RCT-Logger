// GPIO18 에 연결된 LED 1초간 켜고 끄기

const Gpio = require('onoff').Gpio;
const led = new Gpio(530, 'out');

led.writeSync(1);
console.log('LED is on');

setTimeout((_: unknown) => {
  led.writeSync(0);
  console.log('LED is off');
  led.unexport();
}, 1000);

process.on('SIGINT', _ => {
  led.unexport();
  process.exit();
});