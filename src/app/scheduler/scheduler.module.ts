import { forwardRef, Module } from '@nestjs/common';

import { HeartbeatModule } from '../heartbeat/heartbeat.module';
import { MonitorModule } from '../monitor/monitor.module';
import { SchedulerService } from './services/scheduler.service';

@Module({
  imports: [HeartbeatModule, forwardRef(() => MonitorModule)],
  providers: [SchedulerService],
  exports: [SchedulerService],
})
export class SchedulerModule {}
