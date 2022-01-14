import { forwardRef, Module } from '@nestjs/common';
import { MonitorModule } from '../monitor/monitor.module';
import { TransmitterModule } from '../transmitter/transmitter.module';

import { WorkerModule } from '../worker/worker.module';
import { SchedulerService } from './services/scheduler.service';

@Module({
  imports: [forwardRef(() => TransmitterModule), forwardRef(() => WorkerModule), forwardRef(() => MonitorModule)],
  providers: [SchedulerService],
  exports: [SchedulerService],
})
export class SchedulerModule {}
