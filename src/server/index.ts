import {
  Led,
  Logger,
} from "src/common";
import { Downloader } from "src/downloader";
import { Receiver } from "src/receiver";

export class Server
{
  private readonly logger = new Logger(Server.name);

  constructor(
    private readonly io: IO,
    private readonly led: Led,
  ) {}

  open() {}

}
