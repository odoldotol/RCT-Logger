import { Config } from "./config";
import { EnvKey } from "./const";

export class DatabaseConfig {

  private readonly socketPath: string;
  private readonly storagePath: string;
  private readonly batchInterval: number;

  constructor(
    private readonly config: Config
  ) {
    const socketPath = this.config.get(EnvKey.DB_SOCKET_PATH);
    const storagePath = this.config.get(EnvKey.DB_STORAGE_PATH);
    const batchInterval = Number(this.config.get(EnvKey.DB_BATCH_INTERVAL));

    if (
      socketPath == null ||
      storagePath == null ||
      Number.isSafeInteger(batchInterval) == false || batchInterval <= 0
    ) {
      throw new Error("enviroment variables are not available. check env file.");
    } else {
      this.socketPath = socketPath;
      this.storagePath = storagePath;
      this.batchInterval = batchInterval;
    }
  }

  public getSocketPath(): string {
    return this.socketPath;
  }

  public getStoragePath(): string {
    return this.storagePath;
  }

  public getBatchInterval(): number {
    return this.batchInterval;
  }

}
