import { ReceiverInterface } from "../../..//logger/ioInterface";
import { Observable } from "rxjs";
import {
  B103ExtractedData,
  Logger,
  Router
} from "../../..//common";
import { LogController } from "../log";

export class ReceiverRouter
  implements Router
{

  private readonly logger = new Logger(ReceiverRouter.name);

  private readonly receiverDataStream: Observable<B103ExtractedData>;

  constructor(
    private readonly receiverInterface: ReceiverInterface,
    private readonly logController: LogController
  ) {
    this.receiverDataStream = this.receiverInterface.getDataStream();
  }

  public listen() {
    this.receiverDataStream
    // .pipe() // address 검증 => 순서 틀리면 워드 순서 조정
    .subscribe(
      dataBuffer => {
        this.logController.log(dataBuffer);
      }
    );

    this.logger.log("ReceiverRouter is listening.");
  }
 
}
