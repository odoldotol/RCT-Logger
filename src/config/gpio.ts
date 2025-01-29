import {
  Direction,
  GpioName,
  Level,
  PullUpDown
} from "src/common";
import { Config } from "./config";
import { EnvKey } from "./const";

export class GpioConfig
{
  private readonly GpioMap = new Map<GpioName, Gpio>();

  constructor(
    private readonly config: Config
  ) {
    const AR20_PIN = Number(this.config.get(EnvKey.AR20_PIN));
    const AR20_DEBOUNCE = Number(this.config.get(EnvKey.AR20_DEBOUNCE));

    const SERIAL_PIN = Number(this.config.get(EnvKey.SERIAL_PIN));

    const SERIAL_CLK_PIN = Number(this.config.get(EnvKey.SERIAL_CLK_PIN));
    const SERIAL_CLK_DEBOUNCE = Number(this.config.get(EnvKey.SERIAL_CLK_DEBOUNCE));

    if (
      Number.isSafeInteger(AR20_PIN) &&
      Number.isSafeInteger(AR20_DEBOUNCE) &&
      Number.isSafeInteger(SERIAL_PIN) &&
      Number.isSafeInteger(SERIAL_CLK_PIN) &&
      Number.isSafeInteger(SERIAL_CLK_DEBOUNCE)
    ) {

      this.GpioMap.set(GpioName.RECEIVER_AR20, new Gpio(
        AR20_PIN,
        Direction.In,
        PullUpDown.Down,
      ).setDebounceTimeout(AR20_DEBOUNCE));

      this.GpioMap.set(GpioName.RECEIVER_SERIAL, new Gpio(
        SERIAL_PIN,
        Direction.In,
        PullUpDown.Down,
      ));

      this.GpioMap.set(GpioName.RECEIVER_SERIAL_CLK, new Gpio(
        SERIAL_CLK_PIN,
        Direction.In,
        PullUpDown.Down,
      ).setDebounceTimeout(SERIAL_CLK_DEBOUNCE));

    } else {
      throw new Error("enviroment variables are not available. check env file.");
    }
  }

  public getGpio(name: GpioName): Gpio {
    return this.GpioMap.get(name)!;
  }

}

export class Gpio
{
  public readonly initialValue: Level = Level.Low;
  public readonly activeLow: boolean | null = null;

  /**
   * microsecond
   */
  public debounceTimeout: number | null = null;

  constructor(
    public readonly pin: number,
    public readonly direction: Direction,
    public readonly pullUpDown: PullUpDown,
  ) {}

  /**
   * @param timeout microsecond
   */
  public setDebounceTimeout(timeout: number): this {
    this.debounceTimeout = timeout;
    return this;
  }

}
