import { InjectQueue } from '@nestjs/bull';
import { Cron, CronExpression } from '@nestjs/schedule';
import { Queue } from 'bull';
import { InjectableService } from '../../../common/decorators/common.decorator';
import { Queues } from '../queue.module';

import { createBullBoard } from '@bull-board/api';
import { BullAdapter } from '@bull-board/api/bullAdapter';
import * as _Queue from 'bull';

import { FastifyAdapter as BullFastifyAdapter } from '@bull-board/fastify';
import { NestFastifyApplication } from '@nestjs/platform-fastify';
import { BasicQueue } from '../interfaces/queue.interface';

@InjectableService()
export class BullQueueService implements BasicQueue {
  constructor(@InjectQueue('events') private eventQueue: Queue) {}

  async sendEvent(queue: Queues, data: any): Promise<void> {
    if (queue === Queues.Events) {
      await this.eventQueue.add(data);
    } else {
      throw new Error('Queue not found');
    }
  }

  setupBullBoard(app: NestFastifyApplication): void {
    const bullServerAdapter = new BullFastifyAdapter();

    const q = [];
    const path = '/admin/queues';

    for (const [, value] of Object.entries(Queues)) {
      q.push(new BullAdapter(new _Queue(value)));
    }

    createBullBoard({
      queues: q,
      serverAdapter: bullServerAdapter,
    });

    bullServerAdapter.setBasePath(path);

    app.register(bullServerAdapter.registerPlugin(), {
      prefix: path,
      basePath: path,
    });
  }

  // @Cron('*/15 * * * * *')
  async clearQueue(): Promise<void> {
    for (const queue of Object.keys(Queues)) {
      if (queue === Queues.Events) {
        await this.eventQueue.clean(10000, 'completed');
      }
    }
  }
}
