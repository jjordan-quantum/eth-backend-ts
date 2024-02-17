import {getPinoPrettyFileLogger} from "../config/getPinoPrettyFileLogger";
import {getPinoPrettyLogger} from "../config/getPinoPrettyLogger";
import {settings} from "../config/settings";
import pino from "pino";
import fs from "fs";

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

  // assumes using file logging
  static rotate(prefix: string): void {
    // renames the current file being used in the pino transport
    // logger continues to write to this file, even when file name changes
    fs.renameSync(
      `${settings.logFilePath}/${settings.logFileName}`,
      `${settings.logFilePath}/${prefix}-${settings.logFileName}`,
    );

    // assign new pino instance to the logger field of the wrapper class
    // now all calls to PinoLogger.logger.info() will call this instance
    this.logger = getPinoPrettyFileLogger(settings.logFileName, settings.logFilePath, settings.logLevelForService);
  }
}