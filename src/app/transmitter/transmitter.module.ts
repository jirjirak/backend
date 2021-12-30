import { forwardRef, Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { DeterminerModule } from '../determiner/determiner.module';
import { QueueModule } from '../queue/queue.module';
import { SchedulerModule } from '../scheduler/scheduler.module';
import { SocketClientService } from './services/socket-client.service';
import { SocketServerService } from './services/socket-server.service';
import { TransmitterService } from './services/transmitter.service';
@Module({
  imports: [forwardRef(() => SchedulerModule), QueueModule, DeterminerModule],
  providers: [TransmitterService, SocketClientService, SocketServerService],
  exports: [TransmitterService],
})
export class TransmitterModule {}
