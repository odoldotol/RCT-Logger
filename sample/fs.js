const {
  readFile,
  readdir,
} = require('node:fs/promises');

const { createReadStream } = require('fs');

readdir("./").then(console.log);
// readFile("./README.m")
// .then(console.log)
// .catch((e) => {
//   // console.dir(e);
//   // console.error(e);
//   console.log(e.errno);
// });

const stream = createReadStream("bitdata.dat")
.on("close", () => {
  console.log("close");
})
.on("data", (chunk) => {
  console.log(`Received ${chunk.length} bytes of data.`);
  stream.resume();
})
.on("end", () => {
  console.log("end");
})
.on("error", (e) => {
  console.error(e);
})
.on("open", () => {
  console.log("open");
})
.on("ready", () => {
  console.log("ready");
})
.on("pause", () => {
  console.log("pause");
})
.on("resume", () => {
  console.log("resume");
})
// .on("readable", () => {
//   console.log("readable");
//   console.log(stream.read());
// });