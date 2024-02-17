import {getPinoPrettyFileLogger} from "../config/getPinoPrettyFileLogger";
import {getPinoPrettyLogger} from "../config/getPinoPrettyLogger";
import {settings} from "../config/settings";

export class Logger {
  static logger = (settings.logToFile)
    ? getPinoPrettyFileLogger(settings.logFileName, settings.logFilePath, settings.logLevelForService)
    : getPinoPrettyLogger(settings.logLevelForService);

  static info(message: string): void {
    this.logger.info(message);
  }

  static error(message: string, error?: Error): void {
    error ? this.logger.error(error, message) : this.logger.error(message);
  }

  static debug(message: string): void {
    this.logger.debug(message);
  }

  static warn(message: string): void {
    this.logger.warn(message);
  }
}