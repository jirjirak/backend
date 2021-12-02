import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { EventModule } from '../event/event.module';

import { HealthCheckService } from './services/health-check.service';

@Module({
  imports: [EventModule],
  providers: [HealthCheckService],
  exports: [HealthCheckService],
})
export class HeartbeatModule {}
