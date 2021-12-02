import { Module } from '@nestjs/common';
import { EventModule } from '../event/event.module';
import { QueueModule } from '../queue/queue.module';

import { HealthCheckService } from './services/health-check.service';

@Module({
  imports: [EventModule, QueueModule],
  providers: [HealthCheckService],
  exports: [HealthCheckService],
})
export class HeartbeatModule {}
