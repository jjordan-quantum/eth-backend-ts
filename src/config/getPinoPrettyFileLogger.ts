import fs from "fs";
const pino = require('pino');

export function getPinoPrettyFileLogger(
  logFileName: string,
  logFilePath: string,
  logLevel: string,
): any {
  if(!fs.existsSync(logFilePath)) {
    fs.mkdirSync(logFilePath);
  }

  return pino({
    level: logLevel,
    transport: {
      target: 'pino-pretty',
      //level: logLevel,
      options: {
        colorize: false,
        ignore: 'pid,hostname',
        translateTime: "UTC:mm-dd-yyyy HH:MM:ss.l",
        destination: `${logFilePath}/${logFileName}`,
      },
    }
  });
}
