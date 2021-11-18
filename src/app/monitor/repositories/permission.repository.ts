import { EntityRepository } from 'typeorm';

import { BasicRepository } from '../../../common/basic/repository.basic';
import { Permission } from '../entity/permission.entity';

@EntityRepository(Permission)
export class PermissionRepository extends BasicRepository<Permission> {}
