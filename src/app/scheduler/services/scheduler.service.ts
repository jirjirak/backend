import { Logger } from '@nestjs/common';
import { isEmpty } from 'class-validator';
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
  logger = new Logger('Scheduler');

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

  addJob(expression: string, monitor: Monitor): boolean {
    let cron: CronJob;

    if (monitor.type === MonitorType.Http) {
      cron = new CronJob(expression, async () => {
        //

        const job = this.findJob(expression, monitor.type);

        if (!job) {
          throw new Error(`job ${expression} - ${monitor.type} notfound`);
        }

        this.healthCheckService.httpHealthCheck(job.monitors);
      });
    }

    if (!cron) {
      return false;
    }

    const jobStorage: JobStorage = {
      expression,
      cron,
      type: MonitorType.Http,
      monitors: [monitor],
    };

    this.jobs.push(jobStorage);

    cron.start();

    this.logger.log(`job ${expression} - ${monitor.type} started `);

    this.logger.log(`monitor ${monitor.friendlyName} added to ${expression} - ${monitor.type} job`);

    return true;
  }

  addMonitorToJob(expression: string, monitor: Monitor): boolean {
    const job = this.findJob(expression, monitor.type);

    if (!job) {
      return false;
    }

    job.monitors.push(monitor);

    this.logger.log(`monitor ${monitor.friendlyName} added to ${expression} - ${monitor.type} job`);

    return true;
  }

  removeMonitorFromJob(expression: string, monitor: Monitor): boolean {
    const job = this.findJob(expression, monitor.type);

    if (!job) {
      return false;
    }

    job.monitors.filter((m) => m.id !== monitor.id);

    if (isEmpty(job.monitors.length)) {
      job.cron.stop();

      this.logger.log(`job ${expression} - ${monitor.type}  removed `);
    }

    return true;
  }

  async ProcessMonitors(monitors: Monitor[]): Promise<void> {
    for (let monitor of monitors) {
      //

      let expression = monitor.cronExpression;

      if (isEmpty(monitor.cronExpression)) {
        expression = this.generateCronExpression(monitor.interval);
        monitor = await this.monitorService.updateMonitorCron(monitor.id, expression);
      }

      const jobExist = this.findJob(expression, monitor.type);

      if (jobExist) {
        this.addMonitorToJob(expression, monitor);
      } else {
        this.addJob(expression, monitor);
      }

      if (monitor.status !== MonitorStatus.Enabled) {
        await this.monitorService.updateMonitorStatus(monitor.id, MonitorStatus.Enabled);
      }
    }
  }
}
