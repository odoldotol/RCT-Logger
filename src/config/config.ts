import { EnvKey } from "./const";

export class Config
{
  constructor() {
    require('dotenv').config();
  }

  public get(key: EnvKey): string | null {
    return process.env[key] || null;
  }

  public getString(envKey: EnvKey): string {
    const value = this.get(envKey);
    if (value == null) {
      throw new Error(`enviroment variable ${envKey} is not available.`);
    }

    return value;
  }

  public getInt(envKey: EnvKey): number {
    const int = parseInt(this.get(envKey) ?? "");
    
    if (Number.isSafeInteger(int) == false) {
      throw new Error(`enviroment variable ${envKey} is not available.`);
    }

    return int;
  }

}
