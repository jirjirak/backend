import { EntityRepository } from 'typeorm';

import { BasicRepository } from '../../../common/basic/repository.basic';
import { Team } from '../entities/team.entity';

@EntityRepository(Team)
export class TeamRepository extends BasicRepository<Team> {}
