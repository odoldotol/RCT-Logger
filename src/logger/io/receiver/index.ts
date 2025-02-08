import {
  B103ExtractedData,
  B192DataWord6,
  B1Subject,
  extractWordData,
  IO,
  packDateBuffer,
  SubjectValue,
  // Logger
} from "src/common";
import {
  HandlerArg,
  ReceiverStatus
} from "./status";
import {
  ReceiverInterface
} from "src/logger/ioInterface";
import {
  ChildProcess,
  exec,
  fork
} from "child_process";
import { RCTProtocol } from "./rctProtocol";
import P from "node:path";

/**
 * @Todo 차일드의 헬스체크/복구/로깅
 */
export class Receiver
  implements IO
{
  // private readonly logger = new Logger(Receiver.name);

  private child: ChildProcess;

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
    this.child = this.forkChild();
    this.listenChild();
  }

  public open() {
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

  private pushData(buffer: B103ExtractedData) {
    this.receiverInterface.pushData(buffer);
  }

  private openChild() {
    this.child.send(ChildSignal.Open);
  }

  private closeChild() {
    this.child.send(ChildSignal.Close);
  }

  private runChild() {
    this.child.send(ChildSignal.Run);
  }

  private stopChild() {
    this.child.send(ChildSignal.Stop);
    this.rctProtocol.reset();
  }

  private listenChild() {
    this.child.on('spawn', () => {
      console.log(`child process spawned, pid: ${this.child.pid}`);

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
          console.log(`chrt stdout: ${stdout}`);
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
            console.log(`chrt stdout: ${stdout}`);
          }
        });
      });
    });

    this.child.on('message', (message) => {
      console.log('child process message:', message);
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
      console.log(`child process exited with code ${code} and signal ${signal}`);
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

}

export const enum ChildSignal {
  Close,
  Open,
  Stop,
  Run,
  Health
}
