import {
  Direction,
  GpioName,
  Level,
  PullUpDown
} from "../common";
import { Config } from "./config";
import { EnvKey } from "./const";

export class GpioConfigService
{
  private readonly GpioMap = new Map<GpioName, GpioConfig>();

  constructor(
    private readonly config: Config
  ) {
    const AR20_PIN = Number(this.config.get(EnvKey.AR20_PIN));
    const AR20_DEBOUNCE = Number(this.config.get(EnvKey.AR20_DEBOUNCE));

    const SERIAL_PIN = Number(this.config.get(EnvKey.SERIAL_PIN));

    const SERIAL_CLK_PIN = Number(this.config.get(EnvKey.SERIAL_CLK_PIN));
    const SERIAL_CLK_DEBOUNCE = Number(this.config.get(EnvKey.SERIAL_CLK_DEBOUNCE));

    if (
      Number.isSafeInteger(AR20_PIN) && AR20_PIN != 0 &&
      Number.isSafeInteger(AR20_DEBOUNCE) && AR20_DEBOUNCE != 0 &&
      Number.isSafeInteger(SERIAL_PIN) && SERIAL_PIN != 0 &&
      Number.isSafeInteger(SERIAL_CLK_PIN) && SERIAL_CLK_PIN != 0 &&
      Number.isSafeInteger(SERIAL_CLK_DEBOUNCE) && SERIAL_CLK_DEBOUNCE != 0
    ) {

      this.GpioMap.set(GpioName.RECEIVER_AR20, new GpioConfig(
        AR20_PIN,
        Direction.In,
        PullUpDown.Down,
      ).setDebounceTimeout(AR20_DEBOUNCE));

      this.GpioMap.set(GpioName.RECEIVER_SERIAL, new GpioConfig(
        SERIAL_PIN,
        Direction.In,
        PullUpDown.Down,
      ));

      this.GpioMap.set(GpioName.RECEIVER_SERIAL_CLK, new GpioConfig(
        SERIAL_CLK_PIN,
        Direction.In,
        PullUpDown.Down,
      ).setDebounceTimeout(SERIAL_CLK_DEBOUNCE));

    } else {
      throw new Error("enviroment variables are not available. check env file.");
    }
  }

  public getGpio(name: GpioName): GpioConfig {
    return this.GpioMap.get(name)!;
  }

}

export class GpioConfig
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
