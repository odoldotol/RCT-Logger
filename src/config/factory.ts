import { Config } from "./config";
import { DatabaseConfig } from "./database";
import { GpioConfigService } from "./gpio";

class ConfigFactoryStatic {

  public create() {
    const config = new Config();

    const gpioConfigService = new GpioConfigService(config);
    const databaseConfig = new DatabaseConfig(config);

    return {
      gpioConfigService,
      databaseConfig,
    };
  }

}

export const ConfigFactory = new ConfigFactoryStatic();