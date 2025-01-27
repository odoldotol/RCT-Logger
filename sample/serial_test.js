const Gpio = require('onoff').Gpio;

const sclk = new Gpio(523, 'in', 'rising');
const data = new Gpio(522, 'in');
const receiverStatus = new Gpio(534, 'in', 'both');

// let buffer = [];

// sclk.watch((err, value) => {
//   if (err) {
//     throw err;
//   }

//   if (value === 1) {
//     data.read((err, value) => {
//       if (err) {
//         throw err;
//       }
//       buffer.push(`${value}`);
//     });
//     // console.timeEnd('interrupt');
//     // console.time('interrupt');
//   } else {
//     // Must Not Reach Here
//     console.error('Clock is falling edge');
//   }
// });

// const interval = setInterval(() => {
//   // console.log(buffer.join(''));
//   buffer = [];
// }, 500);

receiverStatus.read((err, value) => {
  if (err) {
    throw err;
  }

  if (value === 1) {
    console.log('ON Start');
  } else {
    console.log('OFF Start');
  }
  console.time('time');
});

const interval = setInterval(() => {
  receiverStatus.watch((err, value) => {
    if (err) {
      throw err;
    }

    if (value === 1) {
      console.timeEnd('time');
      console.log('ON');
      console.time('time');
    } else {
      console.timeEnd('time');
      console.log('OFF');
      console.time('time');
      receiverStatus.unwatchAll();
    }
  });
}, 1000);

process.on('SIGINT', _ => {
  clearInterval(interval);
  sclk.unexport();
  data.unexport();
  receiverStatus.unexport();
});

// console.time('interrupt');