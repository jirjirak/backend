import { Module } from '@nestjs/common';
import { DeterminerModule } from '../determiner/determiner.module';
import { QueueModule } from '../queue/queue.module';
import { SocketClientService } from './services/socket-client.service';
import { SocketServerService } from './services/socket-server.service';
import { TransmitterService } from './services/transmitter.service';
@Module({
  imports: [QueueModule, DeterminerModule],
  providers: [TransmitterService, SocketClientService, SocketServerService],
  exports: [TransmitterService],
})
export class TransmitterModule {}
