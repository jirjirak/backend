import { Module } from '@nestjs/common';

import { HealthCheckService } from './services/health-check.service';

@Module({
  providers: [HealthCheckService],
  exports: [HealthCheckService],
})
export class HeartbeatModule {}
