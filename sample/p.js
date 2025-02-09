const { fork, execSync, exec } = require("child_process");
const { fromEvent } = require('rxjs');
const X = require('rxjs/operators');

// const PigGpio = require('pigpio').Gpio;

// const status = new PigGpio(22, {
//   mode: PigGpio.INPUT,
//   pullUpDown: PigGpio.PUD_DOWN,
// }).on('alert', (level, tick) => {});

// status.glitchFilter(100);

// status.enableAlert();


const child = fork("c.js",
  { stdio: ['pipe', 'pipe', 'pipe', 'ipc'] }
);

process.on("SIGINT", () => {
  console.log('parent: SIGINT');
  child.kill("SIGINT");
  process.exit();
});

process.on("SIGTERM", () => {
  console.log('parent: SIGTERM');
  child.kill("SIGTERM");
  process.exit();
});

child.on('close', (code) => {
  console.log(`child process exited with code ${code}`);
});

child.on('disconnect', () => {
  console.log('child process disconnected');
});

child.on('error', (err) => {
  console.error('child process error:', err);
});

child.on('exit', (code, signal) => {
  console.log(`child process exited with code ${code} and signal ${signal}`);
});

child.on('spawn', () => {
  console.log(`child process spawned, pid: ${child.pid}`);
  // console.log(execSync(`chrt -f -p 99 ${child.pid}`).toString());
  // console.log(execSync(`chrt -p ${child.pid}`).toString());

  exec(`chrt -f -p 99 ${child.pid}`, (error, stdout, stderr) => {
    if (error) {
      console.error(`chrt error: ${error.message}`);
      return;
    }
    if (stderr) {
      console.error(`chrt stderr: ${stderr}`);
      return;
    }
    if (stdout) {
      console.log(`chrt stdout: ${stdout}`);
    }

    exec(`chrt -p ${child.pid}`, (error, stdout, stderr) => {
      if (error) {
        console.error(`chrt error: ${error.message}`);
        return;
      }
      if (stderr) {
        console.error(`chrt stderr: ${stderr}`);
        return;
      }
      if (stdout) {
        console.log(`chrt stdout: ${stdout}`);
      }
    });
  });
});



child.stderr.on('data', (data) => {
  console.error(`stderr: ${data}`);
});

child.stderr.on('error', (err) => {
  console.error('stderr error:', err);
});

fromEvent(child.stdout, 'data')
.subscribe({
  next: (data) => {
    data.forEach(processSerial);
  },
  error: (err) => {
    console.error('stdout error:', err);
  },
  complete: () => {
    console.log('complete');
  }
});


child.stdout.on('error', (err) => {
  console.error('stdout error:', err);
});

setTimeout(() => {
  child.send(1);
}, 1000);

setTimeout(() => {
  child.send(0);
  console.log("stop");
  syncWordCnt = 1;
  syncronized = false;
  cycleBufferIdx = 0;
}, 600000);


const cycleBuffer = new Uint8Array(256);

const wordLength = 32;
let syncWordCnt = 1;
let syncronized = false;
let cycleBufferIdx = 0;

function processSerial(level) {
  const isSyncWord = findSyncWord(level);
  if (
    !isSyncWord &&
    syncronized
  ) {
    // console.log('addBuffer', cycleBufferIdx, level);
    addBuffer(level);
  } else if (
    isSyncWord &&
    syncronized
  ) {
    // if (cycleBufferIdx != 223) {
      console.log('cycleBufferIdx', cycleBufferIdx);
    // }
    cycleBufferIdx = 0;
    // console.log(cycleBuffer.slice(cycleBufferIdx-31, cycleBufferIdx).join('') + "1");
    // process.stdout.write(cycleBuffer.slice(0, 223));
    // console.log(cycleBuffer);
    (console.log((() => {
      let str = "";
      for (let i = 0; i < 192; i++) {
        str += cycleBuffer[i];
        if (i === 31 || i === 63 || i === 95 || i === 127 || i === 159) {
          str += "\n";
        }
      }
      return str;
    })()));
    // process.stdout.write("11111");
  } else if (
    isSyncWord &&
    !syncronized
  ) {
    syncronized = true;
    // console.log('syncronized');
  }
}

function findSyncWord(level) {

  if (syncWordCnt == 1) {
    level == 1 && syncWordCnt++;
  } else if (
    2 <= syncWordCnt &&
    syncWordCnt <= 30
  ) {
    level == 0 ? syncWordCnt++ : syncWordCnt = 2;
  } else if (syncWordCnt == 31) {
    level == 1 ? syncWordCnt++ : syncWordCnt = 1;
  } else if (syncWordCnt == 32) {
    syncWordCnt = 1;
    return level == 1;
  }

  return false;
}

function addBuffer(level) {
  cycleBuffer[cycleBufferIdx++] = level;
}