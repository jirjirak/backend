import { MessageBody, SubscribeMessage } from '@nestjs/websockets';
import { Socket } from 'socket.io-client';
import { BasicController } from '../../../common/basic/Basic.controller';

@BasicController('event-listener')
export class EventListenerController {

}
