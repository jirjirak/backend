import { Logger } from '@nestjs/common';
import { CronJob } from 'cron';
import { isEmpty } from 'lodash';
import { HealthCheckService } from 'src/app/heartbeat/services/health-check.service';
import { Monitor } from 'src/app/monitor/entity/monitor.entity';
import { JobStorage } from 'src/app/scheduler/interface/scheduler.interface';
import { InjectableService } from 'src/common/decorators/common.decorator';
import { UtilsService } from 'src/common/service/utils.service';

@InjectableService()
export class WorkerService {
  jobs: JobStorage[] = [];
  logger = new Logger('Worker');

  constructor(private utilsService: UtilsService, private healthCheckService: HealthCheckService) {}

  private createCronJob(expression: string): CronJob {
    return new CronJob(expression, async () => {
      this.logger.verbose(`job ${expression} started`);

      const jobTriggeredAt = this.utilsService.currentTime();

      const job = this.findJob(expression);

      if (!job) {
        throw new Error(`job ${expression} notfound`);
      }

      await this.healthCheckService.healthCheck(job.monitors, jobTriggeredAt);

      this.logger.verbose(`job ${expression} finished`);
    });
  }

  private findJob(expression: string): JobStorage {
    return this.jobs.find((job) => job.expression === expression);
  }

  private removeJob(expression: string): void {
    const job = this.findJob(expression);

    if (job) {
      job.cron.stop();
      this.jobs = this.jobs.filter((job) => job.expression !== expression);

      this.logger.verbose(`job ${expression} removed `);
    }
  }

  private addJob(expression: string): boolean {
    const cron = this.createCronJob(expression);

    const jobStorage: JobStorage = {
      expression,
      cron,
      monitors: [],
    };

    this.jobs.push(jobStorage);

    cron.start();
    this.logger.verbose(`job ${expression} started `);

    return true;
  }

  private addMonitorToJob(expression: string, monitor: Monitor): boolean {
    const job = this.findJob(expression);

    if (!job) {
      return false;
    }

    job.monitors.push(monitor);

    this.logger.verbose(`monitor ${monitor.friendlyName} added to ${expression} job`);

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
    }

    return true;
  }

  async ProcessMonitor(monitor: Monitor): Promise<void> {
    const { cronExpression } = monitor;

    const jobExist = this.findJob(cronExpression);

    if (!jobExist) {
      this.addJob(cronExpression);
    }

    this.addMonitorToJob(cronExpression, monitor);
  }
}
