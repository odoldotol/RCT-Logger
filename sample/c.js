const os = require('os');
os.setPriority(-20);

process.on("SIGINT", () => {
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

const onoffSclk = new OoffGpio(523, 'in');
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
    bitStorage[0] = serial.digitalRead();
    process.stdout.write(bitStorage, (err) => {
      if (err) {
        process.stderr.write(`process.stdout.write error: ${err}\n`);
      }
    });
  } else {
    // Must Not Reach Here
    process.stderr.write('sclk falling edge error\n');
  }
});

const bitStorage = new Uint8Array(1);