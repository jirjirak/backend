import { Logger } from '@nestjs/common';
import { CronJob } from 'cron';
import { isEmpty } from 'lodash';
import { HealthCheckService } from 'src/app/heartbeat/services/health-check.service';
import { Monitor } from 'src/app/monitor/entity/monitor.entity';
import { MonitorType, MonitorStatus } from 'src/app/monitor/enum/monitor.enum';
import { MonitorService } from 'src/app/monitor/services/monitor.service';
import { JobStorage } from 'src/app/scheduler/interface/scheduler.interface';
import { InjectableService } from 'src/common/decorators/common.decorator';
import { UtilsService } from 'src/common/service/utils.service';

@InjectableService()
export class WorkerService {
  jobs: JobStorage[] = [];
  logger = new Logger('Worker');

  constructor(
    private utilsService: UtilsService,
    private healthCheckService: HealthCheckService,
    private monitorService: MonitorService,
  ) {}

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
        const jobTriggeredAt = this.utilsService.currentTime();

        const job = this.findJob(expression, monitor.type);

        if (!job) {
          throw new Error(`job ${expression} - ${monitor.type} notfound`);
        }

        await this.healthCheckService.healthCheck(job.monitors, jobTriggeredAt);
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
    const job = this.findJob(expression);

    if (!job) {
      return false;
    }

    job.monitors.push(monitor);

    this.logger.log(`monitor ${monitor.friendlyName} added to ${expression} job`);

    return true;
  }

  removeMonitorFromJob(expression: string, monitorId: number): boolean {
    const job = this.findJob(expression);

    if (!job) {
      return false;
    }

    job.monitors = job.monitors.filter((m) => m.id !== monitorId);

    if (isEmpty(job.monitors.length)) {
      this.removeJob(expression);
      this.logger.log(`job ${expression} removed `);
    }

    return true;
  }

  async ProcessMonitors(monitors: Monitor[]): Promise<void> {
    for (let monitor of monitors) {
      //

      let cronExpression = monitor.cronExpression;

      if (isEmpty(monitor.cronExpression)) {
        cronExpression = this.generateCronExpression(monitor.interval);
        monitor = await this.monitorService.updateMonitorCron(monitor.id, cronExpression);
      }

      const jobExist = this.findJob(cronExpression, monitor.type);

      if (jobExist) {
        this.addMonitorToJob(cronExpression, monitor);
      } else {
        this.addJob(cronExpression, monitor);
      }

      if (monitor.status !== MonitorStatus.Enabled) {
        await this.monitorService.updateMonitorStatus(monitor.id, MonitorStatus.Enabled);
      }
    }
  }
}
