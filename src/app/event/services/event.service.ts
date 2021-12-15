import { DeepPartial } from 'typeorm';
import { InjectableService } from '../../../common/decorators/common.decorator';
import { Event } from '../entities/event.entity';
import { EventRepository } from '../repositories/event.repository';

@InjectableService()
export class EventService {
  constructor(private eventRepository: EventRepository) {}

  async saveEvent(event: DeepPartial<Event>): Promise<Event> {
    return await this.eventRepository.createAndSave(event, { relations: ['monitor'] });
  }
}
