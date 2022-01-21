import { EntityRepository, SaveOptions } from 'typeorm';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';

import { BasicRepository } from '../../../common/basic/repository.basic';
import { Permission } from '../entity/permission.entity';

@EntityRepository(Permission)
export class PermissionRepository extends BasicRepository<Permission> {
  async updateById(
    id: number,
    data: QueryDeepPartialEntity<Permission>,
    options?: { returning?: boolean; relations?: string[] },
  ): Promise<Permission> {
    return super.updateById(id, data, options);
  }

  async createAndSave(
    data: QueryDeepPartialEntity<Permission>,
    options?: SaveOptions & { relations?: string[] },
  ): Promise<Permission> {
    return super.createAndSave(data, options);
  }
}
