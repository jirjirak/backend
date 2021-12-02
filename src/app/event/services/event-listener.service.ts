import { Process, Processor } from '@nestjs/bull';
import { DoneCallback } from 'bull';
import { InjectableService } from '../../../common/decorators/common.decorator';
import { Queues } from '../../queue/queue.module';

@Processor(Queues.Events)
@InjectableService()
export class EventListenerService {
  @Process({ concurrency: 1 })
  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  async process(job: any, done: DoneCallback) {
    console.log(job.id, 'job');

    done();
  }
}
