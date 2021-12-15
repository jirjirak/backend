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

  constructor(private httpHealthCheckService: HttpHealthCheckService, private queueService: QueueService) {}

  async healthCheck(monitors: Monitor[], jobTriggeredAt: Date): Promise<void> {
    const type = monitors[0].type;

    if (type === MonitorType.Http) {
      await this.httpHealthCheckService.healthCheck(monitors, jobTriggeredAt);
    }
  }

  async saveHealthCheckResult(data: Event): Promise<Event> {
    // get monitor here

    return await this.httpHealthCheckService.saveHttpHealthCheckResult(data);
  }

  // async checkEventIsOK(event: Event): Promise<boolean> {
  //   if (event.monitor.type === MonitorType.Http) {
  //     return await this.httpHealthCheckService.httpHealthCheckResultIsOk(event.monitor, event);
  //   }
  // }
}
