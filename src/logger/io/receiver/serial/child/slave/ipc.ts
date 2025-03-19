import { IPCMessage } from "../interface";

const _ipc = (() => {
  if (process.send == undefined) {
    throw new Error("Child process does not have IPC.");
  }

  return process.send.bind(process);
})();

export const ipc = (msg: IPCMessage) => {
  return _ipc(msg, (err: any) => {
    if (err) {
      process.stderr.write(`Child | IPC Error: ${err}\n`);
    }
  });
};