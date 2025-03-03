import { Config } from "./config";
import { DatabaseConfig } from "./database";
import { GpioConfigService } from "./gpio";
import { HeartbeatConfigService } from "./heartbeat";
import { LoggerConfig } from "./logger";

class ConfigFactoryStatic {

  public create() {
    const config = new Config();

    const loggerConfig = new LoggerConfig(config);
    const gpioConfigService = new GpioConfigService(config);
    const databaseConfig = new DatabaseConfig(config);
    const heartbeatConfigService = new HeartbeatConfigService(config);

    return {
      loggerConfig,
      gpioConfigService,
      databaseConfig,
      heartbeatConfigService,
    };
  }

}

export const ConfigFactory = new ConfigFactoryStatic();