export class Config
{
  constructor() {
    require('dotenv').config();
  }

  public get(key: string): string | null {
    return process.env[key] || null;
  }

}
