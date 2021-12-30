import { Logger } from '@nestjs/common';
import { InjectableService } from 'src/common/decorators/common.decorator';
import { Worker } from '../entities/worker.entity';
import { WorkerStatus } from '../enum/worker.enum';
import { WorkerRepository } from '../repositories/worker.repository';

@InjectableService()
export class ManageWorkerService {
  private logger = new Logger(ManageWorkerService.name);

  constructor(private workerRepository: WorkerRepository) {}

  async findWorkerByUUID(uuid: string): Promise<Worker> {
    const worker = await this.workerRepository.findOne({ where: { uuid }, relations: ['dataCenter'] });
    return worker;
  }

  async updateWorkerStatus(id: number, status: WorkerStatus): Promise<Worker> {
    return await this.workerRepository.updateById(id, { status }, { relations: ['dataCenter'] });
  }
}
