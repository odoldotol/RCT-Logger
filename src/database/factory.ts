import { Database } from "./database";

export class DatabaseFactory {
  static create() {
      return new Database();
  }
}
