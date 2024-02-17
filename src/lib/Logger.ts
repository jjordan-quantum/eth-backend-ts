// /import {getPinoPrettyFileLogger} from "../config/getPinoPrettyFileLogger";
import {getPinoPrettyLogger} from "../config/getPinoPrettyLogger";

export class Logger {
  //static logger = getPinoPrettyFileLogger();
  static logger = getPinoPrettyLogger();

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