import { Logger } from '@nestjs/common';
import { isEmpty } from 'class-validator';
import { CronJob } from 'cron';
import { WorkerService } from 'src/app/worker/services/worker.service';
import { isMonolithArchitecture, isWorkerMode } from 'src/config/app.config';

import { InjectableService } from '../../../common/decorators/common.decorator';
import { UtilsService } from '../../../common/service/utils.service';
import { HealthCheckService } from '../../heartbeat/services/health-check.service';
import { Monitor } from '../../monitor/entity/monitor.entity';
import { MonitorStatus, MonitorType } from '../../monitor/enum/monitor.enum';
import { MonitorService } from '../../monitor/services/monitor.service';
import { JobStorage } from '../interface/scheduler.interface';

@InjectableService()
export class SchedulerService {
  logger = new Logger('Scheduler');

  constructor(private workerService: WorkerService) {}

  async ProcessMonitors(monitors: Monitor[]): Promise<void> {
    await this.workerService.ProcessMonitors(monitors);
  }

  async assignWorkerToMonitor(monitor: Monitor): Promise<void> {
    if (isMonolithArchitecture) {
      await this.ProcessMonitors([monitor]);
    } else {
      // do stuff
    }
  }
}
