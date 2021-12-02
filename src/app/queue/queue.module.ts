import { BullModule, BullModuleOptions } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { BullQueueService } from './services/bull-queue.service';
import { QueueService } from './services/queue.service';

export enum Queues {
  Events = 'events',
  Alerts = 'alerts',
  Notifications = 'notifications',
}

const bullQueues: BullModuleOptions[] = [
  {
    name: Queues.Events,
  },
  {
    name: Queues.Alerts,
  },
  {
    name: Queues.Notifications,
  },
];

@Module({
  imports: [BullModule.registerQueue(...bullQueues)],
  providers: [BullQueueService, QueueService],
  exports: [QueueService],
})
export class QueueModule {}
