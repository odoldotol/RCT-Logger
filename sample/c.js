// process.send(process.pid);

process.on("SIGINT", () => {
  onoffSclk.unwatchAll();
  onoffSclk.unexport();
});

process.on("SIGTERM", () => {
  onoffSclk.unwatchAll();
  onoffSclk.unexport();
});

process.on("message", (msg) => {
  if (msg == 1) {
    // console.time("rising");
    onoffSclk.setEdge('rising');
  } else if (msg == 0) {
    // console.timeEnd("rising");
    onoffSclk.setEdge('none');
  }
});

const PigGpio = require('pigpio').Gpio;
const OoffGpio = require('onoff').Gpio;

const onoffSclk = new OoffGpio(523, 'in', 'none', {});
const serial = new PigGpio(10, {
  mode: PigGpio.INPUT,
  pullUpDown: PigGpio.PUD_DOWN,
});

onoffSclk.watch((err, value) => {
  if (err) {
    process.stderr.write(`sclk.watch error: ${err}\n`);
    return;
  }

  if (value === 1) {
    // console.timeEnd("rising");
    // console.time("rising");
    // processSerial();
    process.stdout.write(Buffer.allocUnsafe(1).fill(serial.digitalRead()), (err) => {
      if (err) {
        process.stderr.write(`process.stdout.write error: ${err}\n`);
      }
    });
  } else {
    // Must Not Reach Here
    process.stderr.write('sclk falling edge error\n');
  }
});
