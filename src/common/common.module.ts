import { Global, Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';

import { MonitorModule } from '../app/monitor/monitor.module';
import { SchedulerModule } from '../app/scheduler/scheduler.module';
import { BootstrapService } from './service/bootstrap.service';
import { UtilsService } from './service/utils.service';

@Global()
@Module({
  imports: [MonitorModule, SchedulerModule],
  providers: [BootstrapService, UtilsService],
  exports: [UtilsService, BootstrapService],
})
export class CommonModule {}
