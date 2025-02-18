import { 
  Observable,
  Subject
} from "rxjs";
import { Level } from "../../../common";

/**
 * extends LevelOut
 */
export class LedInterface {

  private readonly levelStream = new Subject<Level>();

  public high(): void {
    this.levelStream.next(Level.High);
  }

  public low(): void {
    this.levelStream.next(Level.Low);
  }

  public blinkOnce(ms = 100): void {
    this.high();
    setTimeout(() => this.low(), ms);
  }

  public getLevelStream(): Observable<Level> {
    return this.levelStream.asObservable();
  }

}
