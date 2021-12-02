import { InjectableService } from '../../../common/decorators/common.decorator';
import { BasicQueue } from '../interfaces/queue.interface';
import { Queues } from '../queue.module';
import { BullQueueService } from './bull-queue.service';

@InjectableService()
export class QueueService implements BasicQueue {
  constructor(private bullQueueService: BullQueueService) {}

  async sendEvent(queue: Queues, data: any): Promise<void> {
    return await this.bullQueueService.sendEvent(queue, data);
  }
}
