const Gpio = require('onoff').Gpio;
const button = new Gpio(523, 'in', 'rising');

button.watch((err, value) => {
  if (err) {
    throw err;
  }

  if (value === 1) {
    console.timeEnd('interrupt');
    console.time('interrupt');
  } else {
    console.log('Clock is falling edge');
  }
});

process.on('SIGINT', _ => {
  button.unexport();
});

setInterval(() => {
  new Array(2000).fill(0).forEach((n) => {
    n += 1;
  });
}, 1000);

console.time('interrupt');