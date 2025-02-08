import { B103ExtractedData } from "../../../common";
import { LogRepository } from "../../../logger/database";

export class LogService {

  constructor(
    private readonly logRepository: LogRepository
  ) {}

  public log(dataBuffer: B103ExtractedData) {
    this.logRepository.create(dataBuffer);
  }

}