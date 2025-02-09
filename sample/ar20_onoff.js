const OoffGpio = require('onoff').Gpio;

const ar20 = new OoffGpio(534, 'in', 'none', { debounceTimeout: 10 });

ar20.setEdge('both');

console.time("edge");

ar20.watch((err, value) => {
  if (err) {
    console.error(`ar20.watch error: ${err}`);
  }

  if (value === 1) {
    console.timeLog("edge", 1);
  } else if (value === 0) {
    console.timeLog("edge", 0);
  } else {
    console.timeLog("edge", value);
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