import {
  B103ExtractedData,
  B192DataWord6,
  B1Subject,
  extractWordData,
  IO,
  Logger,
  packDateBuffer,
  SubjectValue,
} from "../../../common";
import {
  ReceiverStatus,
  Status,
  StatusEventCode
} from "./status";
import {
  LedInterface,
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

export class Receiver
  implements IO
{
  private readonly logger = new Logger(Receiver.name);

  private child: ChildProcess;

  private waitingActivatedChild: Promise<void> | null = null;
  private waitingActivatedChildResolver: (() => void) | null = null;
  private waitingOpenedChildResolver: (() => void) | null = null;

  constructor(
    private readonly status: ReceiverStatus,
    private readonly rctProtocol: RCTProtocol,
    private readonly receiverInterface: ReceiverInterface,
    private readonly testLedInterface: LedInterface,
  ) {
    this.waitChildActivating();
    this.child = this.forkChild();
    this.listenChild();
  }

  public async open() {
    await this.openChild();

    this.status
    .on(Status.ON, this.onHandler.bind(this))
    .on(Status.OFF, this.offHandler.bind(this));

    this.status.open();
  }

  public close() {
    this.status.close();
    this.closeChild();
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

  private pushData(buffer: B103ExtractedData) {
    this.receiverInterface.pushData(buffer);
  }

  /**
   * 예외 발생 없어야함.
   * 발생하면 uncaught 로 죽게 냅둬.
   */
  private onHandler(code: StatusEventCode) {
    if (code == StatusEventCode.Work) {
      this.pushData(this.getAr20TurnedOnB103Data());
    }

    this.runChild();
  }

  /**
   * 예외 발생 없어야함.
   * 발생하면 uncaught 로 죽게 냅둬.
   */
  private offHandler(code: StatusEventCode) {
    if (code == StatusEventCode.Work) {
      this.pushData(this.getAr20TurnedOffB103Data());
    }

    this.stopChild();
  }

  private async openChild(): Promise<void> {
    if (this.waitingActivatedChild == null) {
      throw new Error("Cannot wait for child activating.");
    }

    await this.waitingActivatedChild;

    if (this.child.stdout == null) {
      throw new Error("Child stdout is null.");
    }

    // Todo - Refac: Non-following mode, PassThrough/Transform 스트림 등을 pipeline 으로 채이닝
    this.child.stdout
    .pipe(this.rctProtocol)
    .on('data', (data: B192DataWord6) => {
      this.testLedInterface.blinkOnce();
      this.pushData(this.getB103ExtractedData(data));
    });

    this.ipc({ signal: ChildSignal.Open });

    return new Promise<void>((resolve) => {
      this.waitingOpenedChildResolver = () => {
        resolve();
        this.waitingOpenedChildResolver = null;
      };
    });
  }

  private closeChild() {
    this.ipc({ signal: ChildSignal.Close });
  }

  private runChild() {
    this.ipc({ signal: ChildSignal.Run });
    this.rctProtocol.reset();
  }

  private stopChild() {
    this.ipc({ signal: ChildSignal.Stop });
  }

  /**
   * @todo 정리좀..
   */
  private listenChild() {
    this.child.on('spawn', () => {
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
    });

    this.child.on('message', (message: IPCMessage) => {
      switch (message.signal) {
        case ChildSignal.Log:
          message.log && this.logger.log(`Child | ${message.log}`);
          break;
        case ChildSignal.Activated:
          if (this.waitingActivatedChildResolver == null) {
            this.logger.warn("Child activated but no resolver.");
          } else {
            this.waitingActivatedChildResolver();
          }
          break;
        case ChildSignal.Open:
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
    
    this.child.on('exit', async (code, signal) => {
      this.logger.log(`child process exited with code ${code} and signal ${signal}`);

      this.waitChildActivating();
      this.startChild();

      await this.openChild();

      if (this.status.isOn() == true) {
        this.runChild();
      } else {
        this.stopChild();
      }
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
