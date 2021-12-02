import { Payload, Ctx, RedisContext, EventPattern } from '@nestjs/microservices';
import { BasicController } from '../../../common/basic/Basic.controller';
import { wait } from '../../../common/functions/utils.func';

@BasicController('event-listener')
export class EventListenerController {}
