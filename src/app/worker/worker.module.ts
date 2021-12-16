import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HeartbeatModule } from '../heartbeat/heartbeat.module';
import { MonitorModule } from '../monitor/monitor.module';
import { WorkerRepository } from './repositories/worker.repository';
import { WorkerService } from './services/worker.service';

@Module({
  imports: [HeartbeatModule, forwardRef(() => MonitorModule), TypeOrmModule.forFeature([WorkerRepository])],
  providers: [WorkerService],
  exports: [WorkerService],
})
export class WorkerModule {}
