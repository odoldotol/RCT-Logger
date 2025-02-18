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
  private timer: NodeJS.Timeout | null = null;

  public on(): void {
    this.reset();
    this.high();
  }

  public off(): void {
    this.reset();
    this.low();
  }

  /**
   * @param ms 1 cycle
   */
  public blinkOnce(ms = 200): void {
    this.reset();

    this.high();
    this.timer = setTimeout(() => this.low(), ms/2);
  }

  /**
   * @param ms 1 cycle
   */
  public blink(ms = 200): void {
    this.reset();

    let flag = false;
    this.timer = setInterval(() => {
      flag = !flag;
      flag ? this.high() : this.low();
    }, ms/2);
  }

  public getLevelStream(): Observable<Level> {
    return this.levelStream.asObservable();
  }

  private reset(): void {
    if (this.timer != null) {
      clearTimeout(this.timer);
      this.timer = null;
    }
  }

  private high(): void {
    this.levelStream.next(Level.High);
  }

  private low(): void {
    this.levelStream.next(Level.Low);
  }

}
