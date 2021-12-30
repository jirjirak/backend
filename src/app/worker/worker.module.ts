import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HeartbeatModule } from '../heartbeat/heartbeat.module';
import { MonitorModule } from '../monitor/monitor.module';
import { WorkerRepository } from './repositories/worker.repository';
import { ManageWorkerService } from './services/manage-worker.service';
import { WorkerService } from './services/worker.service';

@Module({
  imports: [
    forwardRef(() => HeartbeatModule),
    forwardRef(() => MonitorModule),
    TypeOrmModule.forFeature([WorkerRepository]),
  ],
  providers: [WorkerService, ManageWorkerService],
  exports: [WorkerService, ManageWorkerService],
})
export class WorkerModule {}
