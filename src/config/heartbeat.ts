import { Config } from "./config";
import { EnvKey } from "./const";

export class HeartbeatConfigService {
  private readonly configMap = new Map<HeartbeatName, HeartbeatConfig>();

  constructor(
    private readonly config: Config
  ) {
    const appPath = this.config.getString(EnvKey.HEARTBEAT_PATH_APP);
    const appInterval = this.config.getInt(EnvKey.HEARTBEAT_INTERVAL_APP);

    const childPath = this.config.getString(EnvKey.HEARTBEAT_PATH_CHILD);
    const childInterval = this.config.getInt(EnvKey.HEARTBEAT_INTERVAL_CHILD);

    this.configMap
    .set(HeartbeatName.APP, new HeartbeatConfig(appPath, appInterval))
    .set(HeartbeatName.CHILD, new HeartbeatConfig(childPath, childInterval));
  }

  public getHeartbeat(name: HeartbeatName): HeartbeatConfig {
    return this.configMap.get(name)!;
  }

}

export class HeartbeatConfig {
  constructor(
    public readonly path: string,
    public readonly interval: number
  ) {}
}

export const enum HeartbeatName {
  APP,
  CHILD,
}
