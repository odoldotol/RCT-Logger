import { IO, Level } from "src/common";
import { ReceiverSerialClk } from "./clk";
import { ReceiverSerial } from "./serial";

export * from './factory';

export class ReceiverData
  implements IO
{
  private data = (_data: Buffer) => {};
  private error = (_error: any) => {};

  constructor(
    private readonly clk: ReceiverSerialClk,
    private readonly serial: ReceiverSerial,
  ) {}

  public setHandler(
    data: (data: Buffer) => void,
    error: (error: any) => void,
  ) {
    this.data = data;
    this.error = error;
  }

  public open() {
    this.clk.watch((err, value) => {
      if (err) {
        this.error(`sclk.watch error: ${err}\n`);
        return;
      }
    
      if (value === Level.High) {
        this.data(Buffer.allocUnsafe(1).fill(this.serial.digitalRead()));
      } else {
        // Must Not Reach Here
        this.error('sclk falling edge error\n');
      }
    });

    this.clk.open();
    this.serial.open();
  }

  public close() {
    this.clk.close();
    this.serial.close();
  }

  public run() {
    this.clk.run();
  }

  public stop() {
    this.clk.stop();
  }

}
