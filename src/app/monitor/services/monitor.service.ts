import { InjectableService } from '../../../common/decorators/common.decorator';
import { User } from '../../account/entities/user.entity';
import { CreateMonitorBodyDto } from '../dto/monitor/create-monitor.dto';
import { Monitor } from '../entity/monitor.entity';
import { MonitorStatus, MonitorType } from '../enum/monitor.enum';
import { MonitorRepository } from '../repositories/monitor.repository';

@InjectableService()
export class MonitorService {
  constructor(private monitorRepository: MonitorRepository) {}

  async createMonitor(user: User, data: CreateMonitorBodyDto) {
    const { address, directory, type } = data;

    let status: MonitorStatus;

    if (data.status === MonitorStatus.Enabled) {
      status = MonitorStatus.Waiting;
    }

    const MonitorAlreadyExist = await this.monitorRepository.count({
      where: {
        address,
        directory,
        type,
      },
    });

    if (MonitorAlreadyExist) {
      throw new Error('Monitor already exist');
    }

    const monitor = await this.monitorRepository.createAndSave({ ...data, creator: user, status });

    return monitor;
  }

  async updateMonitorCron(monitorId: number, cronExpression: string): Promise<Monitor> {
    return await this.monitorRepository.updateById(monitorId, { cronExpression });
  }

  async updateMonitorStatus(monitorId: number, status: MonitorStatus): Promise<Monitor> {
    return await this.monitorRepository.updateById(monitorId, { status });
  }
}
