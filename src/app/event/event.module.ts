import { Module } from '@nestjs/common';
import { EventListenerController } from './controllers/event-listener.controller';
import { EventListenerService } from './services/event-listener.service';

@Module({
  imports: [],
  controllers: [EventListenerController],
  providers: [EventListenerService],
})
export class EventModule {}
