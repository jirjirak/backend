import { Inject } from '@nestjs/common';
import { ClientRedis } from '@nestjs/microservices';
import { InjectableService } from '../../../common/decorators/common.decorator';
import { PushEventParam } from '../../../common/types/event-handler.type';

@InjectableService()
export class EventHandlerService {
  constructor(@Inject('REDIS') private client: ClientRedis) {}

  async pushEvent(eventPattern: string, param: PushEventParam): Promise<void> {
    // this.client.emit(eventPattern, param);
  }
}
