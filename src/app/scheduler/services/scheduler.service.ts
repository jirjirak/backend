import { BadRequestException } from '@nestjs/common';
import { CronJob } from 'cron';

import { InjectableService } from '../../../common/decorators/common.decorator';
import { HealthCheckService } from '../../heartbeat/services/health-check.service';
import { Monitor } from '../../monitor/entity/monitor.entity';
import { MonitorStatus, MonitorType } from '../../monitor/enum/monitor.enum';
import { MonitorService } from '../../monitor/services/monitor.service';
import { JobStorage } from '../interface/scheduler.interface';

@InjectableService()
export class SchedulerService {
  jobs: JobStorage[] = [];

  constructor(private healthCheckService: HealthCheckService, private monitorService: MonitorService) {}

  private generateRadomNumber(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  generateCronExpression(interval: number): string {
    // convert to second
    interval /= 1000;

    const min = 0;
    const max = interval - 1;

    const randomNumber = this.generateRadomNumber(min, max);

    return `${randomNumber}/${interval} * * * * *`;
  }

  findJob(expression: string, type?: MonitorType): JobStorage {
    if (type) {
      return this.jobs.find((job) => job.expression === expression && job.type === type);
    } else {
      return this.jobs.find((job) => job.expression === expression);
    }
  }

  removeJob(expression: string): void {
    const jobStorage = this.findJob(expression);

    if (jobStorage) {
      jobStorage.cron.stop();
      this.jobs = this.jobs.filter((job) => job.expression !== expression);
    }
  }

  addJob(expression: string, monitor: Monitor): void {
    const cron = new CronJob(expression, async () => {
      await this.healthCheckService.httpHealthCheck();
    });

    const jobStorage: JobStorage = {
      expression,
      cron,
      type: MonitorType.Http,
    };

    this.jobs.push(jobStorage);

    cron.start();
  }

  private monitorIsValid(monitors: Monitor[]) {
    // if (monitors.filter((monitor) => monitor.status === MonitorStatus.Waiting).length === 0) {
    //   throw new Error('monitor already has cron expression');
    // }
    // if (monitor.status === MonitorStatus.Disabled) {
    //   throw new Error('monitor is disabled');
    // }
  }

  async ProcessMonitors(monitors: Monitor[]): Promise<void> {
    // check if monitors is valid
    this.monitorIsValid(monitors);

    for (let monitor of monitors) {
      // let expression

      const expression = this.generateCronExpression(monitor.interval);

      if (monitor.status === MonitorStatus.Waiting) {
        monitor = await this.monitorService.updateMonitorCron(monitor.id, expression);
      }

      const cronExist = this.findJob(expression, monitor.type);

      if (cronExist) {
      } else {
        this.addJob(expression, monitor);
      }
    }
  }
}
