import { Process, Processor } from '@nestjs/bull';
import { DoneCallback } from 'bull';
import { InjectableService } from '../../../common/decorators/common.decorator';
import { wait } from '../../../common/functions/utils.func';
import { HealthCheckService } from '../../heartbeat/services/health-check.service';
import { Queues } from '../../queue/queue.module';

@Processor(Queues.Events)
@InjectableService()
export class EventListenerService {
  constructor(private healthCheckService: HealthCheckService) {}

  @Process({ concurrency: 1 })
  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  async process(job: any, done: DoneCallback) {
    await this.healthCheckService.saveHealthCheckResult(job.data);

    done();
  }
}
