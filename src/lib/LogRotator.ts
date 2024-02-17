import {settings} from "../config/settings";
import StaticComponent from "../lib/StaticComponent";
import {Logger} from "./Logger";
const cron = require('node-cron');

class LogRotator extends StaticComponent {
  static busy: boolean = false;
  static blockchainClientTriggered: boolean = false;
  static messageDispatchQueueTriggered: boolean = false;
  static getUpdatesQueueTriggered: boolean = false;
  //static emitter: EventEmitter = new EventEmitter();

  static start(): void {
    if(settings.logToFile && settings.rotateLogFiles) {
      this.log(`Starting log file rotator`);
      //let schedule  = '0 0 * * *';  // daily
      let schedule  = '0 * * * *';  // hourly

      cron.schedule(schedule, () => {
        LogRotator.rotate();
      });
    } else {
      this.log(`Not using log file rotation`);
    }
  }

  static rotate(): void {
    try {
      const now = new Date();
      //const prefix = `${now.getFullYear()}-${now.getMonth()}-${now.getDate()}`;
      const prefix = `${now.getFullYear()}-${now.getMonth()}-${now.getDate()}-${now.getHours()}h`;
      this.log(`Rotating logs with prefix: ${prefix}`);
      Logger.rotate(prefix);
      this.log(`Done rotating logs`);
    } catch(e: any) {
      console.log(`Error rotating logs`);
      console.log(e);
      LogRotator.error(`Error encountered rotating logs`, e);
    }
  }
}

export default LogRotator;
