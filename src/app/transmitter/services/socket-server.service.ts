import { Logger } from '@nestjs/common';
// import {} from '@nestjs/websockets';
import {
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Socket } from 'socket.io-client';
import { Server } from 'socket.io';
import { QueueService } from 'src/app/queue/services/queue.service';
import { Queues } from 'src/app/queue/queue.module';

@WebSocketGateway(5050)
export class SocketServerService implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  logger = new Logger('SocketServerService');

  constructor(private queueService: QueueService) {}

  @WebSocketServer()
  server: Server;

  @SubscribeMessage('events')
  async handleEvent(@MessageBody() data: any): Promise<any> {
    // TODO: change log message
    this.logger.verbose(`Received event`);
    await this.queueService.sendEvent(Queues.Events, data);
    this.logger.verbose(`Event sent to queue: ${Queues.Events}`);
    return true;
  }

  afterInit(): void {
    this.logger.log('Socket.io Server Initilized');
  }

  handleConnection(client: Socket): void {
    this.logger.log(`client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket): void {
    this.logger.log(`client disconnected: ${client.id}`);
  }
}
