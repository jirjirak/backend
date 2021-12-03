import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HeartbeatModule } from '../heartbeat/heartbeat.module';
import { EventListenerController } from './controllers/event-listener.controller';
import { EventRepository } from './repositories/event.repository';
import { EventListenerService } from './services/event-listener.service';
import { EventService } from './services/event.service';

@Module({
  imports: [forwardRef(() => HeartbeatModule), TypeOrmModule.forFeature([EventRepository])],
  controllers: [EventListenerController],
  providers: [EventListenerService, EventService],
  exports: [EventService],
})
export class EventModule {}
