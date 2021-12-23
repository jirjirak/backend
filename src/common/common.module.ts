import { Global, Module } from '@nestjs/common';
import { TransmitterModule } from 'src/app/transmitter/transmitter.module';

import { MonitorModule } from '../app/monitor/monitor.module';
import { SchedulerModule } from '../app/scheduler/scheduler.module';
import { BootstrapService } from './service/bootstrap.service';
import { RedisService } from './service/redis.service';
import { UtilsService } from './service/utils.service';

@Global()
@Module({
  imports: [MonitorModule, SchedulerModule, TransmitterModule],
  providers: [BootstrapService, UtilsService, RedisService],
  exports: [UtilsService, BootstrapService, RedisService],
})
export class CommonModule {}
