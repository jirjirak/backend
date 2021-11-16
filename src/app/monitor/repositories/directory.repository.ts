import { EntityRepository } from 'typeorm';

import { BasicRepository } from '../../../common/basic/repository.basic';
import { Directory } from '../entity/directory.entity';

@EntityRepository(Directory)
export class DirectoryRepository extends BasicRepository<Directory> {}
