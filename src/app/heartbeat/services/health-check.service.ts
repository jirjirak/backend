import { Logger } from '@nestjs/common';

import { InjectableService } from '../../../common/decorators/common.decorator';
import { Monitor } from '../../monitor/entity/monitor.entity';
import { QueueService } from '../../queue/services/queue.service';
import { MonitorType } from '../../monitor/enum/monitor.enum';
import { HttpHealthCheckService } from './http-health-check.service';
import { Event } from '../../event/entities/event.entity';

@InjectableService()
export class HealthCheckService {
  logger = new Logger();

  constructor(private httpHealthCheckService: HttpHealthCheckService) {}

  async healthCheck(monitors: Monitor[], jobTriggeredAt: Date): Promise<void> {
    const httpMonitors = monitors.filter((m) => m.type === MonitorType.Http);
    await this.httpHealthCheckService.healthCheck(httpMonitors, jobTriggeredAt);
  }

  async saveHealthCheckResult(data: Event): Promise<Event> {
    const { type } = data.monitor;
    let result: Event;

    if (type === MonitorType.Http) {
      result = await this.httpHealthCheckService.saveHttpHealthCheckResult(data);
    }

    return result;
  }
}
