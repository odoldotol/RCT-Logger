const OoffGpio = require('onoff').Gpio;

const ar20 = new OoffGpio(534, 'in', 'both', { debounceTimeout: 1 });

console.time("edge");

ar20.watch((err, value) => {
  if (err) {
    console.error(`ar20.watch error: ${err}`);
  }

  if (value === 1) {
    console.timeLog("edge", 1);
  } else {
    console.timeLog("edge", 0);
  }
});

process.on('SIGINT', () => {
  ar20.unwatchAll();
  ar20.unexport();
});

process.on('SIGTERM', () => {
  ar20.unwatchAll();
  ar20.unexport();
});