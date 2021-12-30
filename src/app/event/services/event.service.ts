import { DeepPartial } from 'typeorm';
import { InjectableService } from '../../../common/decorators/common.decorator';
import { Event } from '../entities/event.entity';
import { EventRepository } from '../repositories/event.repository';
import { v4 as uuid4 } from 'uuid';
@InjectableService()
export class EventService {
  constructor(private eventRepository: EventRepository) {}

  async saveEvent(event: DeepPartial<Event>): Promise<Event> {
    if (!event.uuid) {
      event.uuid = uuid4();
    }

    const createdEvent = await this.eventRepository.createAndSave(event, { relations: ['monitor'] });
    return createdEvent;
  }
}
