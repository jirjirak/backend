import { Queues } from '../queue.module';

export interface BasicQueue {
  sendEvent(queue: Queues, data: any): Promise<void>;
}
