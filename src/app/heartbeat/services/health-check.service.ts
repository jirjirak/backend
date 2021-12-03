import { Logger } from '@nestjs/common';

import { InjectableService } from '../../../common/decorators/common.decorator';
import { Monitor } from '../../monitor/entity/monitor.entity';
import { QueueService } from '../../queue/services/queue.service';
import { MonitorType } from '../../monitor/enum/monitor.enum';
import { HttpHealthCheckService } from './http-health-check.service';

@InjectableService()
export class HealthCheckService {
  logger = new Logger();

  constructor(private httpHealthCheckService: HttpHealthCheckService, private queueService: QueueService) {}

  async healthCheck(monitors: Monitor[], jobTriggeredAt: Date): Promise<void> {
    const type = monitors[0].type;

    if (type === MonitorType.Http) {
      await this.httpHealthCheckService.healthCheck(monitors, jobTriggeredAt);
    }
  }

  async saveHealthCheckResult(data: any): Promise<boolean> {
    let status = true;

    status = await this.httpHealthCheckService.saveHttpHealthCheckResult(data);

    return status;
  }
}
