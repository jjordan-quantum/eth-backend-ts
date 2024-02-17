const pino = require('pino');

export function getPinoPrettyLogger(path?: string): any {
 return pino({
   transport: {
     target: 'pino-pretty',
     options: {
       colorize: true
     }
   }
 });
}
