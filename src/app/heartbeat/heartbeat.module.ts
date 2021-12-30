import { forwardRef, Module } from '@nestjs/common';
import { EventModule } from '../event/event.module';
import { QueueModule } from '../queue/queue.module';
import { TransmitterModule } from '../transmitter/transmitter.module';

import { HealthCheckService } from './services/health-check.service';
import { HttpHealthCheckService } from './services/http-health-check.service';

@Module({
  imports: [forwardRef(() => TransmitterModule), forwardRef(() => EventModule)],
  providers: [HealthCheckService, HttpHealthCheckService],
  exports: [HealthCheckService],
})
export class HeartbeatModule {}
