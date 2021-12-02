import { EntityRepository } from 'typeorm';

import { BasicRepository } from '../../../common/basic/repository.basic';
import { Monitor } from '../entity/monitor.entity';

@EntityRepository(Monitor)
export class MonitorRepository extends BasicRepository<Monitor> {}
