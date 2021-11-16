import { EntityRepository } from 'typeorm';

import { BasicRepository } from '../../../common/basic/repository.basic';
import { User } from '../entities/user.entity';

@EntityRepository(User)
export class UserRepository extends BasicRepository<User> {}
