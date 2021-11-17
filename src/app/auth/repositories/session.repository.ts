import { EntityRepository } from 'typeorm';

import { BasicRepository } from '../../../common/basic/repository.basic';
import { Session } from '../entities/session.entity';

@EntityRepository(Session)
export class SessionRepository extends BasicRepository<Session> {}
