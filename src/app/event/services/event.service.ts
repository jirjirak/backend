import { DeepPartial } from 'typeorm';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';
import { InjectableService } from '../../../common/decorators/common.decorator';
import { Event } from '../entities/event.entity';
import { EventRepository } from '../repositories/event.repository';

@InjectableService()
export class EventService {
  constructor(private eventRepository: EventRepository) {}

  async saveEvent(events: DeepPartial<Event[]>): Promise<void> {
    await this.eventRepository.createQueryBuilder('event').insert().values(events).execute();
  }
}
