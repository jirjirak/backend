import { InjectableService } from '../../../common/decorators/common.decorator';
import { User } from '../../account/entities/user.entity';
import { MonitorType } from '../enum/monitor.enum';
import { MonitorRepository } from '../repositories/monitor.repository';

@InjectableService()
export class MonitorService {
  constructor(private monitorRepository: MonitorRepository) {}

  async createMonitor(user: User) {
    const monitor = await this.monitorRepository.createAndSave({
      address: 'google.com',
      directory: { id: 21 },
      type: MonitorType.Http,
      friendlyName: 'Google',
      interval: 10000,
      creator: { id: 7 },
    });

    return monitor;
  }
}
