import { BasicRepository } from 'src/common/basic/repository.basic';
import { EntityRepository } from 'typeorm';
import { DataCenter } from '../entities/data-center.entity';

@EntityRepository(DataCenter)
export class DataCenterRepository extends BasicRepository<DataCenter> {}
