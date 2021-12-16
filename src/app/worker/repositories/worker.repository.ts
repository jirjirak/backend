import { BasicRepository } from 'src/common/basic/repository.basic';
import { EntityRepository } from 'typeorm';
import { Worker } from '../entities/worker.entity';

@EntityRepository(Worker)
export class WorkerRepository extends BasicRepository<Worker> {}
