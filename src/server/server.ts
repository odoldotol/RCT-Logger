import {
  Logger,
} from "src/common";

export class Server
{
  private readonly logger = new Logger("RCTLogger_Server");

  constructor
    private readonly io: IO,
    private readonly app: Application,
    private readonly ledB: Led,
   {}

  public async start(): Promise<void> {}

  public async terminate(): Promise<void> {}

}
