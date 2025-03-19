import { EventEmitter } from "node:stream";
import {
  Level,
  SyncOpenIO,
} from "../../../../common";
import { ReceiverSerialClk } from "./clk";
import { ReceiverSerialData } from "./data";
import { SlaveLogger } from "./child/slave/logger";

/**
 * @todo logger 주입받지 말기, 데이터 채널 주입받기
 */
export class ReceiverSerial
  extends EventEmitter<{ data: [Buffer] }>
  implements SyncOpenIO
{
  private readonly name = Object.getPrototypeOf(this).constructor.name;
  private readonly logger = new SlaveLogger(this.name);

  constructor(
    private readonly clk: ReceiverSerialClk,
    private readonly serial: ReceiverSerialData,
  ) {
    super();
  }

  public open() {
    this.clk.watch((err, value) => {
      if (err) {
        this.logger.error(`sclk.watch error: ${err}\n`);
        return;
      }
    
      if (value == Level.High) {
        this.emit('data', Buffer.allocUnsafe(1).fill(this.serial.digitalRead()));
      } else {
        // Must Not Reach Here
        this.logger.error('sclk falling edge error\n');
      }
    });

    this.clk.open();
    this.serial.open();

    return true;
  }

  public close() {
    this.clk.close();
    this.serial.close();

    this.logger.log(`Closed.`);

    return true;
  }

  public run() {
    this.clk.run();

    this.logger.log(`Running.`);
  }

  public stop() {
    this.clk.stop();

    this.logger.log(`Stopped.`);
  }

}