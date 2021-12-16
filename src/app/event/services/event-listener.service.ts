import { Process, Processor } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { DoneCallback } from 'bull';
import { InjectableService } from '../../../common/decorators/common.decorator';
import { HealthCheckService } from '../../heartbeat/services/health-check.service';
import { Queues } from '../../queue/queue.module';

@Processor(Queues.Events)
@InjectableService()
export class EventListenerService {
  logger = new Logger();

  constructor(private healthCheckService: HealthCheckService) {}

  @Process({ concurrency: 1 })
  async process(job: any, done: DoneCallback): Promise<void> {
    try {
      await this.healthCheckService.saveHealthCheckResult(job.data);
      this.logger.debug(job.id);
      done();
    } catch (error) {
      done(new Error(error));
    }
  }
}
