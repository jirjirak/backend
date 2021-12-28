import { Process, Processor } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { DoneCallback } from 'bull';
import { InjectableService } from '../../../common/decorators/common.decorator';
import { HealthCheckService } from '../../heartbeat/services/health-check.service';
import { Queues } from '../../queue/queue.module';

@Processor(Queues.Events)
@InjectableService()
export class EventListenerService {
  logger = new Logger('EventListenerService');

  constructor(private healthCheckService: HealthCheckService) {}

  @Process({ concurrency: 1 })
  async evetnProcessor(job: any, done: DoneCallback): Promise<void> {
    this.logger.verbose(`Processing event: ${job.id}`);

    try {
      await this.healthCheckService.saveHealthCheckResult(job.data);
      this.logger.verbose(`Event processed: ${job.id}`);
      done();
    } catch (error) {
      this.logger.error(`Error processing event: ${job.id}`);
      done(new Error(error));
    }
  }
}
