import {
  Observable,
  Subject
} from "rxjs";
import { B103ExtractedData } from "src/common";

export class ReceiverInterface {

  private isSetIsOnCallee = false;
  private isOnCallee = () => false;

  private readonly dataStream = new Subject<B103ExtractedData>();

  public setIsOnCallee(callee: () => boolean) {
    if (this.isSetIsOnCallee == false) {
      this.isOnCallee = callee;
      this.isSetIsOnCallee = true;
    }
  }

  public isOn(): boolean {
    return this.isOnCallee();
  }

  public pushData(data: B103ExtractedData): void {
    this.dataStream.next(data);
  }

  public getDataStream(): Observable<B103ExtractedData> {
    return this.dataStream.asObservable();
  }

}
