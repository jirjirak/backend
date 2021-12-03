import { EntityRepository } from 'typeorm';
import { BasicRepository } from '../../../common/basic/repository.basic';
import { Event } from '../entities/event.entity';

@EntityRepository(Event)
export class EventRepository extends BasicRepository<Event> {}
