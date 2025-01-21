export class Logger
{
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
  ): void {
    console.error(this.write(
      message,
      "ERROR",
    ));
  }

  public warn(
    message: string,
  ): void {
    console.warn(this.write(
      message,
      "WARN",
    ));
  }

  private write(
    message: string,
    level: string,
  ): string {
    return `[RCTLogger] ${process.pid}   - ${this.getDate()} ${level.padStart(7)} [${this.context}] ${message}`;
  }

  private getDate(): string {
    return new Date().toLocaleString("en-GB", { timeZone: "Asia/Seoul" });
  }

}
