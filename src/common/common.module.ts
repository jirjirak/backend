import { Global, Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';

import { MonitorModule } from '../app/monitor/monitor.module';
import { SchedulerModule } from '../app/scheduler/scheduler.module';
import { BootstrapService } from './service/bootstrap.service';
import { RedisService } from './service/redis.service';
import { UtilsService } from './service/utils.service';

@Global()
@Module({
  imports: [MonitorModule, SchedulerModule],
  providers: [BootstrapService, UtilsService, RedisService],
  exports: [UtilsService, BootstrapService, RedisService],
})
export class CommonModule {}
