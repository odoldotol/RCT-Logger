const { fork } = require("child_process");

const child = fork("serial_cycle_child.js",
  { stdio: ['pipe', 'pipe', 'pipe', 'ipc'] }
);

process.on("SIGINT", () => {
  console.log('parent: SIGINT');
  child.kill("SIGINT");
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
  console.log('child process spawned');
});



child.stderr.on('data', (data) => {
  console.error(`stderr: ${data}`);
});

child.stderr.on('error', (err) => {
  console.error('stderr error:', err);
});

child.stdout.on('data', (data) => {
  const a = new Uint8Array(data);
  console.log('---------------------------------');
  console.log(a.slice(0, 32).join(''));
  console.log(a.slice(32, 64).join(''));
  console.log(a.slice(64, 96).join(''));
  console.log(a.slice(96, 128).join(''));
  console.log(a.slice(128, 160).join(''));
  console.log(a.slice(160, 192).join(''));
  console.log('---------------------------------');
});

child.stdout.on('error', (err) => {
  console.error('stdout error:', err);
});

setTimeout(() => {
  child.send(1);
}, 1000);

setTimeout(() => {
  child.send(0);
}, 20000);