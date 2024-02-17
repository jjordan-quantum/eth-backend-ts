import {Logger} from "./Logger";

class StaticComponent {
  static log(message: string): void {
    Logger.info(`[${this.name}] ${message}`);
  }

  static error(message: string, error?: any): void {
    Logger.error(`[${this.name}] ${message}`, error);
  }

  static debug(message: string): void {
    Logger.debug(`[${this.name}] ${message}`);
  }

  static warn(message: string): void {
    Logger.warn(`[${this.name}] ${message}`);
  }
}

export default StaticComponent;
