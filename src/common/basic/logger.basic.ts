import { ConsoleLogger } from '@nestjs/common';
import { pino } from 'pino';

const logger = pino(
  pino.destination({
    // dest: './my-file', // omit for stdout
    // minLength: 4096, // Buffer before writing
    sync: false, // Asynchronous logging
  }),
);

export class MyLogger extends ConsoleLogger {
  log(message: any, context?: string): void {
    super.log.apply(this, arguments);
  }
}
