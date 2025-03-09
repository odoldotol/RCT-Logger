import {
  ChildProcess,
  exec,
  fork
} from "node:child_process";
import {
  EventEmitter,
  Readable
} from "node:stream";
import {
  IO,
  Logger,
  Runner
} from "../../../../common";
import { IPCMessage } from "./interface";
import { Signal } from "./const";
import P from "node:path";

export class ChildMaster
  extends EventEmitter<ChildMasterEventMap>
  implements IO, Runner
{
  private readonly logger = new Logger(ChildMaster.name);

  private child: ChildProcess;

  private waitingActivatedChild: Promise<void> | null = null;
  private waitingActivatedChildResolver: (() => void) | null = null;
  private waitingOpenedChildResolver: (() => void) | null = null;

  // fork, init
  constructor() {
    super();

    this.waitChildActivating();
    this.child = this.fork();
    this.listen();
  }

  public async open() {
    if (this.waitingActivatedChild == null) {
      throw new Error("Cannot wait for child activating.");
    }

    await this.waitingActivatedChild;

    this.ipc({ signal: Signal.Open });

    return new Promise<void>((resolve) => {
      this.waitingOpenedChildResolver = () => {
        resolve();
        this.waitingOpenedChildResolver = null;
      };
    });
  }

  public close() {
    this.ipc({ signal: Signal.Close });
  }

  public run() {
    this.ipc({ signal: Signal.Run });
  }

  public stop() {
    this.ipc({ signal: Signal.Stop });
  }

  public getSerialStream(): Readable {
    if (this.child.stdout == null) {
      throw new Error("Child stdout is null.");
    }

    return this.child.stdout;
  }

  private waitChildActivating(): void {
    this.waitingActivatedChild = new Promise<void>((resolve) => {
      this.waitingActivatedChildResolver = () => {
        resolve();
        this.logger.log("Child activated.");
        this.waitingActivatedChildResolver = null;
      };
    });
  }

  private fork(): ChildProcess {
    const path = P.resolve(__dirname, "init.js");

    return fork(path,
      { stdio: ['pipe', 'pipe', 'pipe', 'ipc'] }
    );
  }

  /**
   * @todo 정리좀..
   */
  private listen() {
    this.child
    .on('spawn', () => {
      this.logger.log(`Child spawned, PID: ${this.child.pid}`);

      exec(`chrt -r -p 1 ${this.child.pid}`, (error, stdout, stderr) => {
        if (error) {
          console.error(`chrt error: ${error.message}`);
          return;
        }
        if (stderr) {
          console.error(`chrt stderr: ${stderr}`);
          return;
        }
        if (stdout) {
          this.logger.log(stdout);
        }

        exec(`chrt -p ${this.child.pid}`, (error, stdout, stderr) => {
          if (error) {
            console.error(`chrt error: ${error.message}`);
            return;
          }
          if (stderr) {
            console.error(`chrt stderr: ${stderr}`);
            return;
          }
          if (stdout) {
            stdout.split('\n').forEach((line) => {
              line && this.logger.log(line);
            });
          }
        });
      });
    })
    .on('message', (message: IPCMessage) => {
      switch (message.signal) {
        case Signal.Log:
          message.log && this.logger.log(`Child | ${message.log}`);
          break;
        case Signal.Activated:
          if (this.waitingActivatedChildResolver == null) {
            this.logger.warn("Child activated but no resolver.");
          } else {
            this.waitingActivatedChildResolver();
          }
          break;
        case Signal.Open:
          if (this.waitingOpenedChildResolver == null) {
            this.logger.warn("Child opened but no resolver.");
          } else {
            this.waitingOpenedChildResolver();
          }
          break;
        default:
          console.error(`child process unknown signal: ${message}`);
          break;
      }
    })
    .on('close', (code) => {
      console.log(`child process exited with code ${code}`);
    })
    .on('disconnect', () => {
      console.log('child process disconnected');
    })
    .on('error', (err) => {
      console.error('child process error:', err);
    })
    .on('exit', async (code, signal) => {
      this.logger.log(`child process exited with code ${code} and signal ${signal}`);

      this.restartOnExit();
      this.emit(ChildMasterEvent.Restarted);
    });

    this.child.stderr?.on('data', (data) => {
      console.error(`stderr: ${data}`);
    });
    
    this.child.stderr?.on('error', (err) => {
      console.error('stderr error:', err);
    });

    this.child.stdout?.on('error', (err) => {
      console.error('stdout error:', err);
    });
  }

  private restartOnExit() {
    if (this.child.connected) {
      this.child.disconnect();
    }

    this.child.stdout
    ?.removeAllListeners()
    .destroy();

    this.child.stderr
    ?.removeAllListeners()
    .destroy();

    this.waitChildActivating();
    this.child = this.fork();
    this.listen();
  }

  private ipc(msg: IPCMessage) {
    return this.child.send(msg);
  }

}

type ChildMasterEventMap = {
  [ChildMasterEvent.Restarted]: [];
};

export const enum ChildMasterEvent {
  Restarted
}
