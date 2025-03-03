const exec = require("child_process").exec;

const mountedDir = process.argv[2];

new Promise((resolve, reject) => {
  exec(`umount ${mountedDir}`, (
    err,
    stdout,
    stderr
  ) => {
    if (err) {
      console.log("err");
      if (
        err.message.includes("not mounted.") ||
        err.message.includes("no mount point specified.")
      ) {
        return resolve();
      }
      return reject(err);
    }

    if (stderr) {
      console.log("stderr");
      return reject(stderr);
    }

    if (stdout == "") {
      return resolve();
    } else {
      console.log("stdout");
      return reject(stdout);
    }
  });
});