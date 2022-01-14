import { Logger } from '@nestjs/common';
import { InjectableService } from 'src/common/decorators/common.decorator';
import { Like } from 'typeorm';
import { FindWorkersQueryDto } from '../dto/manage-worker.controller/find.dto';
import { Worker } from '../entities/worker.entity';
import { WorkerStatus } from '../enum/worker.enum';
import { WorkerRepository } from '../repositories/worker.repository';
import * as jwt from 'jsonwebtoken';
import { v4 as uuid4 } from 'uuid';
import { RegisterWorkerBodyDto } from '../dto/manage-worker.controller/register-worker.dto';
import { User } from 'src/app/account/entities/user.entity';
import { SECRETE_KEY } from 'src/config/app.config';

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

  async updateWorkerConnectionStatus(id: number, data: { connected?: boolean; identifier?: string }): Promise<Worker> {
    const { connected, identifier } = data;

    return await this.workerRepository.updateById(
      id,
      {
        connected,
        identifier,
        lastCheckIn: new Date(),
        connectedAt: connected ? new Date() : null,
        disconnectedAt: connected ? null : new Date(),
      },
      { relations: ['dataCenter'] },
    );
  }

  async updateLastCheckIn(workerId: number): Promise<void> {
    await this.workerRepository
      .createQueryBuilder('worker')
      .update()
      .set({ lastCheckIn: new Date() })
      .where({ id: workerId })
      .execute();
  }

  async findWorkers(query: FindWorkersQueryDto): Promise<[Worker[], number]> {
    const { page, status, friendlyName } = query;

    const where = {
      ...(status ? { status } : {}),
      ...(friendlyName ? { friendlyName: Like(`%${friendlyName}%`) } : {}),
    };

    const [workers, total] = await this.workerRepository.findAndCount({
      where,
      relations: ['dataCenter'],
      page,
      limit: 10,
    });
    return [workers, total];
  }

  async registerWorker(user: User, data: RegisterWorkerBodyDto): Promise<Worker> {
    const worker = await this.workerRepository.createAndSave({
      ...data,
      creator: user,
      uuid: uuid4(),
      status: WorkerStatus.Active,
    });

    return worker;
  }

  async createJwt(worker: Worker): Promise<string> {
    return await new Promise((resolve, reject) => {
      jwt.sign({ uuid: worker.uuid }, SECRETE_KEY, (err, token) => {
        if (err) {
          reject(err);
        }
        resolve(token);
      });
    });
  }
}
