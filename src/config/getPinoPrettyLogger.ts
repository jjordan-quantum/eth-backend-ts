const pino = require('pino');

export function getPinoPrettyLogger(logLevel: string): any {
 return pino({
   level: logLevel,
   transport: {
     target: 'pino-pretty',
     //level: logLevel,
     options: {
       colorize: true
     }
   }
 });
}
