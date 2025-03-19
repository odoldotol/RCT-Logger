export class Logger
{
  protected name = "RCTLogger";

  constructor(
    private readonly context: string,
  ) {}

  public log(
    message: string,
  ): void {
    console.log(this.write(
      message,
      "LOG",
    ));
  }

  public error(
    message: string,
    error?: any,
    ...optionalParams: any[]
  ): void {
    console.error(this.write(
      message,
      "ERROR",
    ));

    if (error) {
      console.error(error, ...optionalParams);
    }
  }

  public warn(
    message: string,
  ): void {
    console.warn(this.write(
      message,
      "WARN",
    ));
  }

  protected write(
    message: string,
    level: string,
  ): string {
    return `[${this.name}] ${process.pid}   - ${this.getDate()} ${level.padStart(7)} [${this.context}] ${message}`;
  }

  private getDate(): string {
    return new Date().toLocaleString("en-GB", { timeZone: "Asia/Seoul" });
  }

}
