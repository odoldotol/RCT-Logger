import {
  Direction,
  Level,
  PullUpDown
} from "../common";
import { Config } from "./config";
import {
  EnvKey,
  LedGpioName,
  ReceiverGpioName
} from "./const";

export class GpioConfigService
{
  private readonly receiverGpioMap = new Map<ReceiverGpioName, GpioConfig>();
  private readonly ledGpioMap = new Map<LedGpioName, GpioConfig>();

  private readonly pinSet = new Set<number>();

  constructor(
    private readonly config: Config
  ) {
    const AR20_PIN = this.getPin(EnvKey.AR20_PIN);
    const AR20_DEBOUNCE = this.getInt(EnvKey.AR20_DEBOUNCE);

    const SERIAL_PIN = this.getPin(EnvKey.SERIAL_PIN);

    const SERIAL_CLK_PIN = this.getPin(EnvKey.SERIAL_CLK_PIN);
    const SERIAL_CLK_DEBOUNCE = this.getInt(EnvKey.SERIAL_CLK_DEBOUNCE);

    const LED_A_PIN = this.getPin(EnvKey.LED_A_PIN);

    const LED_B_PIN = this.getPin(EnvKey.LED_B_PIN);

    const LED_C_PIN = this.getPin(EnvKey.LED_C_PIN);

    const LED_D_PIN = this.getPin(EnvKey.LED_D_PIN);


    this.receiverGpioMap
    .set(ReceiverGpioName.AR20, new GpioConfig(
      AR20_PIN,
      Direction.In,
      PullUpDown.Down,
    ).setDebounceTimeout(AR20_DEBOUNCE))
    .set(ReceiverGpioName.SERIAL, new GpioConfig(
      SERIAL_PIN,
      Direction.In,
      PullUpDown.Down,
    ))
    .set(ReceiverGpioName.SERIAL_CLK, new GpioConfig(
      SERIAL_CLK_PIN,
      Direction.In,
      PullUpDown.Down,
    ).setDebounceTimeout(SERIAL_CLK_DEBOUNCE))

    this.ledGpioMap
    .set(LedGpioName.DownloadGreen, this.createLedGpioConfig(LED_A_PIN))
    .set(LedGpioName.DownloadYellow, this.createLedGpioConfig(LED_B_PIN))
    .set(LedGpioName.DatabaseAppend, this.createLedGpioConfig(LED_C_PIN))
    .set(LedGpioName.Test, this.createLedGpioConfig(LED_D_PIN));

  }

  public getReceiverGpioConfig(name: ReceiverGpioName): GpioConfig {
    return this.receiverGpioMap.get(name)!;
  }

  public getLedGpioConfigIterator(): MapIterator<[LedGpioName, GpioConfig]> {
    return this.ledGpioMap.entries();
  }

  public getLedGpioKeys(): LedGpioName[] {
    return Array.from(this.ledGpioMap.keys());
  }

  /**
   * @returns valid pin number
   */
  private getPin(pinEnvKey: EnvKey): number {
    const PIN = this.getInt(pinEnvKey);

    if (this.pinSet.has(PIN)) {
      // 중복된 핀
      throw new Error(`enviroment variable ${pinEnvKey} is duplicated.`);
    }

    this.pinSet.add(PIN);

    return PIN;
  }

  private getInt(envKey: EnvKey): number {
    const int = parseInt(this.config.get(envKey) ?? "");
    
    if (Number.isSafeInteger(int) == false) {
      throw new Error(`enviroment variable ${envKey} is not available.`);
    }

    return int;
  }

  private createLedGpioConfig(pin: number): GpioConfig {
    return new GpioConfig(
      pin,
      Direction.Out,
      PullUpDown.Down
    );
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
