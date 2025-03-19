import { Readable } from "node:stream";
import {
  AsyncOpenIO,
  B103ExtractedData,
  B192DataWord6,
  B1Subject,
  extractWordData,
  packDateBuffer,
  SubjectValue,
} from "../../../common";
import {
  ChildMaster as SerialChildMaster,
  ChildMasterEvent
} from "./serial";
import {
  ReceiverStatus,
  Status,
  StatusEventCode
} from "./status";
import { RCTProtocol } from "./rctProtocol";
import {
  LedInterface,
  ReceiverInterface
} from "../../../logger/ioInterface";

/**
 * @todo 차일드 추상화
 */
export class Receiver
  implements AsyncOpenIO
{
  private serialStream = new Readable();

  constructor(
    private readonly serialChild: SerialChildMaster,
    private readonly status: ReceiverStatus,
    private readonly rctProtocol: RCTProtocol,
    private readonly receiverInterface: ReceiverInterface,
    private readonly testLedInterface: LedInterface,
  ) {}

  public async open() {
    await this.serialChild
    .on(ChildMasterEvent.Restarted, this.childRestartedHandler.bind(this))
    .open();

    this.serialStream = this.serialChild.getSerialStream();

    this.processSerial();

    this.status
    .on(Status.ON, this.onHandler.bind(this))
    .on(Status.OFF, this.offHandler.bind(this))
    .open();

    return true;
  }

  public close() {
    this.status.close();
    this.serialChild.close();

    return true;
  }

  private processSerial() {
    // Todo - Refac: Non-following mode, PassThrough/Transform 스트림 등을 pipeline 으로 채이닝
    this.serialStream
    .pipe(this.rctProtocol)
    .on('data', (data: B192DataWord6) => {
      this.testLedInterface.blinkOnce();
      this.pushData(this.getB103ExtractedData(data));
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

    this.rctProtocol.reset();
    this.serialChild.run();
  }

  /**
   * 예외 발생 없어야함.
   * 발생하면 uncaught 로 죽게 냅둬.
   */
  private offHandler(code: StatusEventCode) {
    if (code == StatusEventCode.Work) {
      this.pushData(this.getAr20TurnedOffB103Data());
    }

    this.serialChild.stop();
  }

  private async childRestartedHandler() {
    await this.open();

    if (this.status.isOn() == true) {
      this.rctProtocol.reset();
      this.serialChild.run();
    } else {
      this.serialChild.stop();
    }
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
