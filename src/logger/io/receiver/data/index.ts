import { IO, Level } from "../../../../common";
import { ReceiverSerialClk } from "./clk";
import { ReceiverSerial } from "./serial";

export * from './factory';

export class ReceiverData
  implements IO
{
  constructor(
    private readonly clk: ReceiverSerialClk,
    private readonly serial: ReceiverSerial,
    private readonly data: (data: Buffer) => void,
    private readonly log: (log: string) => void,
    private readonly error: (error: any) => void,
  ) {}

  public open() {
    this.clk.watch((err, value) => {
      if (err) {
        this.error(`sclk.watch error: ${err}\n`);
        return;
      }
    
      if (value == Level.High) {
        this.data(Buffer.allocUnsafe(1).fill(this.serial.digitalRead()));
      } else {
        // Must Not Reach Here
        this.error('sclk falling edge error\n');
      }
    });

    this.clk.open();
    this.serial.open();

    this.log('ReceiverData is opened.');
  }

  public close() {
    this.clk.close();
    this.serial.close();
  }

  public run() {
    this.clk.run();

    this.log('ReceiverData is running now.');
  }

  public stop() {
    this.clk.stop();

    this.log('ReceiverData is stopped.');
  }

}
