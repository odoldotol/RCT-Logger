import {
  Observable,
  Subject
} from "rxjs";
import { B103ExtractedData } from "../../../common";

export class ReceiverInterface {

  private readonly dataStream = new Subject<B103ExtractedData>();

  public pushData(data: B103ExtractedData): void {
    this.dataStream.next(data);
  }

  public getDataStream(): Observable<B103ExtractedData> {
    return this.dataStream.asObservable();
  }

}
