import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { EventListenerController } from './controllers/envent-listener.controller';
import { EventHandlerService } from './services/event-handler.service';
import { EventListenerService } from './services/event-listener.service';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'REDIS',
        transport: Transport.REDIS,
        options: {
          url: 'redis://localhost:6379',
        },
      },
    ]),
  ],
  controllers: [EventListenerController],
  providers: [EventListenerService, EventHandlerService],
  exports: [EventHandlerService],
})
export class EventModule {}
