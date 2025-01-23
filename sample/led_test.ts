// GPIO18 에 연결된 LED 1초간 켜고 끄기

const Gpio = require('onoff').Gpio;
const led = new Gpio(530, 'out');

led.writeSync(1);
setTimeout((_: unknown) => {
  led.writeSync(0);
}, 1000);

process.on('SIGINT', _ => {
  led.unexport();
  console.log('LED is off');
  process.exit();
});