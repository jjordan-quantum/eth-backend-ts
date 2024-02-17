import fs from "fs";
const pino = require('pino');

export function getPinoPrettyFileLogger(path?: string): any {
  if(!path && !fs.existsSync('logs')) {
    fs.mkdirSync('logs');
  }

  return pino({
    transport: {
      target: 'pino-pretty',
      options: {
        colorize: false,
        ignore: 'pid,hostname',
        translateTime: "UTC:mm-dd-yyyy HH:MM:ss.l",
        destination: path || `logs/app.log`
      },
    }
  });
}
