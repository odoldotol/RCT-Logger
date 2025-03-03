const rmdir = require('fs').promises.rmdir;

const mountPoint = process.argv[2];

rmdir(mountPoint).catch(err => {
  if (err.message.includes("ENOENT: no such file or directory")) {
    return;
  } else {
    console.log(err)
  }
});