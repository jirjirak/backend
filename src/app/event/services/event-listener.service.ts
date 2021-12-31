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
    this.logger.verbose(`Processing event: ${job.data.uuid}`);

    try {
      await this.healthCheckService.saveHealthCheckResult(job.data);
      this.logger.verbose(`Event processed: ${job.data.uuid}`);
      done();
    } catch (error) {
      this.logger.error(`Error processing event: ${job.data.uuid}`);
      done(new Error(error));
    }
  }
}
