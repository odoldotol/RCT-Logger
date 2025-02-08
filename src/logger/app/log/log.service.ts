import { B103ExtractedData } from "src/common";
import { LogRepository } from "src/logger/database";

export class LogService {

  constructor(
    private readonly logRepository: LogRepository
  ) {}

  public log(dataBuffer: B103ExtractedData) {
    this.logRepository.create(dataBuffer);
  }

}