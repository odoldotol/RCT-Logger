import {
  B103ExtractedData,
  B192DataWord6,
  B1Subject,
  extractWordData,
  IO,
  Logger,
  packDateBuffer,
  SubjectValue,
  // Logger
} from "../../../common";
import {
  HandlerArg,
  ReceiverStatus
} from "./status";
import {
  ReceiverInterface
} from "../../../logger/ioInterface";
import {
  ChildProcess,
  exec,
  fork
} from "child_process";
import { RCTProtocol } from "./rctProtocol";
import P from "node:path";
import {
  ChildSignal,
  IPCMessage
} from "./child";

/**
 * @Todo 차일드의 헬스체크/복구/로깅
 */
export class Receiver
  implements IO
{
  private readonly logger = new Logger(Receiver.name);

  private child: ChildProcess;
  private waitingActivatedChild: Promise<void> | null = null;
  private waitingActivatedChildResolver: (() => void) | null = null;

  private readonly turnedOnHandler = (arg: HandlerArg) => {
    if (arg == HandlerArg.OnRun) {
      this.pushData(this.getAr20TurnedOnB103Data());
    }

    this.runChild();
  };

  private readonly turnedOffHandler = (arg: HandlerArg) => {
    if (arg == HandlerArg.OnRun) {
      this.pushData(this.getAr20TurnedOffB103Data());
    }

    this.stopChild();
  };

  constructor(
    private readonly status: ReceiverStatus,
    private readonly rctProtocol: RCTProtocol,
    private readonly receiverInterface: ReceiverInterface
  ) {
    this.waitChildActivating();
    this.child = this.forkChild();
    this.listenChild();
  }

  public async open() {
    if (this.waitingActivatedChild == null) {
      throw new Error("Cannot wait for child activating.");
    }

    await this.waitingActivatedChild;

    this.child.stdout?.pipe(this.rctProtocol)
    .on('data', (data: B192DataWord6) => {
      this.pushData(this.getB103ExtractedData(data));
    });

    this.status.setHandler(
      this.turnedOnHandler,
      this.turnedOffHandler
    );

    this.receiverInterface.setIsOnCallee(() => this.status.isOn());

    this.status.open();
    this.openChild();
  }

  public close() {
    this.status.close();
    this.closeChild();
  }

  private waitChildActivating(): void {
    this.waitingActivatedChild = new Promise((resolve) => {
      this.waitingActivatedChildResolver = () => {
        resolve();
        this.logger.log("Child activated.");
        this.waitingActivatedChildResolver = null;
      };
    });
  }

  private pushData(buffer: B103ExtractedData) {
    this.receiverInterface.pushData(buffer);
  }

  private openChild() {
    this.ipc({ signal: ChildSignal.Open });
  }

  private closeChild() {
    this.ipc({ signal: ChildSignal.Close });
    this.rctProtocol.reset();
  }

  private runChild() {
    this.ipc({ signal: ChildSignal.Run });
  }

  private stopChild() {
    this.ipc({ signal: ChildSignal.Stop });
    this.rctProtocol.reset();
  }

  private listenChild() {
    this.child.on('spawn', () => {
      this.logger.log(`Child spawned, PID: ${this.child.pid}`);

      exec(`chrt -f -p 99 ${this.child.pid}`, (error, stdout, stderr) => {
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
    });

    this.child.on('message', (message: IPCMessage) => {
      switch (message.signal) {
        case ChildSignal.Activated:
          if (this.waitingActivatedChildResolver == null) {
            this.logger.warn("Child activated but no resolver.");
          } else {
            this.waitingActivatedChildResolver();
          }
          break;
        case ChildSignal.Log:
          message.log && this.logger.log(`Child | ${message.log}`);
          break;
        default:
          console.error(`child process unknown signal: ${message}`);
          break;
      }
    });

    this.child.on('close', (code) => {
      console.log(`child process exited with code ${code}`);
    });
    
    this.child.on('disconnect', () => {
      console.log('child process disconnected');
    });
    
    this.child.on('error', (err) => {
      console.error('child process error:', err);
    });
    
    this.child.on('exit', (code, signal) => {
      this.logger.log(`child process exited with code ${code} and signal ${signal}`);
      
      this.waitChildActivating();
      this.startChild();
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

  // private healthCheck() {}

  // private restartChild() {
  //   this.child.kill("SIGTERM"); // 안끝나면 강제 킬 해야함
  //   this.startChild();
  // }

  private startChild() {
    this.child = this.forkChild();
    this.listenChild();
  }

  private forkChild(): ChildProcess {
    const path = P.resolve(__dirname, "child/init.js");

    return fork(path,
      { stdio: ['pipe', 'pipe', 'pipe', 'ipc'] }
    );
  }

  private getAr20TurnedOnB103Data(): B103ExtractedData {
    return Buffer.concat([
      packDateBuffer(),
      this.getB1Subject(SubjectValue.Ar20TurnedOn),
      Buffer.alloc(96)
    ]) as B103ExtractedData;
  }

  private getAr20TurnedOffB103Data(): B103ExtractedData {
    return Buffer.concat([
      packDateBuffer(),
      this.getB1Subject(SubjectValue.Ar20TurnedOff),
      Buffer.alloc(96)
    ]) as B103ExtractedData;
  }

  private getB103ExtractedData(dataWordRawBuffer: B192DataWord6): B103ExtractedData {
    return Buffer.concat([
      packDateBuffer(),
      this.getB1Subject(SubjectValue.Data),
      extractWordData(dataWordRawBuffer)
    ]) as B103ExtractedData;
  }

  private getB1Subject(subjectValue: SubjectValue): B1Subject {
    return Buffer.allocUnsafe(1).fill(subjectValue) as B1Subject;
  }

  private ipc(msg: IPCMessage) {
    this.child.send(msg);
  }

}
