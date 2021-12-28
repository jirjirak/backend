import { Logger } from '@nestjs/common';
import { InjectableService } from '../../../common/decorators/common.decorator';
import { BasicQueue } from '../interfaces/queue.interface';
import { Queues } from '../queue.module';
import { BullQueueService } from './bull-queue.service';

@InjectableService()
export class QueueService implements BasicQueue {
  logger = new Logger('QueueService');

  constructor(private bullQueueService: BullQueueService) {}

  async sendEvent(queue: Queues, data: any): Promise<void> {
    this.logger.verbose(`Sending event to queue: ${queue}`);
    await this.bullQueueService.sendEvent(queue, data);
    this.logger.verbose(`Event sent to queue: ${queue}`);
  }
}
