import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { NODE_ENV } from 'src/config/app.config';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  private logger = new Logger(LoggerMiddleware.name);

  use(req: Request, res: Response, next: NextFunction): void {
    const t1 = +new Date();

    next();

    const t2 = +new Date();

    let msg: any;
    if (NODE_ENV === 'production') {
      msg = { url: req.url, method: req.method, status: res.statusCode, time: t2 - t1 };
    } else {
      msg = `${req.method} ${req.url} ${t2 - t1}ms`;
    }

    if (res.statusCode < 200) {
      this.logger.log(msg);
    } else if (res.statusCode < 500) {
      this.logger.error(msg);
    }
  }
}
