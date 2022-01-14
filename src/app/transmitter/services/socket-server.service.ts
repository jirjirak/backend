import { forwardRef, Inject, Logger, UseGuards } from '@nestjs/common';
import {
  GatewayMetadata,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { QueueService } from 'src/app/queue/services/queue.service';
import { Queues } from 'src/app/queue/queue.module';
import { SchedulerService } from 'src/app/scheduler/services/scheduler.service';
import { isControllerMode, isMonolithArchitecture, SECRETE_KEY } from 'src/config/app.config';
import { SocketGuard } from 'src/app/auth/guard/socket.guard';
import { Event } from 'src/app/event/entities/event.entity';
import * as jwt from 'jsonwebtoken';
import { SocketListenPort } from 'src/config/socket.config';
import { rejects } from 'assert';

export function SetupWebSocketServer<T extends Record<string, any> = GatewayMetadata>(
  port?: number,
  options?: T,
): ClassDecorator {
  return (target: any): any => {
    if (isMonolithArchitecture || isControllerMode) {
      WebSocketGateway(port, options)(target);
    }
  };
}

// @InjectableService()
@SetupWebSocketServer(SocketListenPort)
export class SocketServerService implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  logger = new Logger('SocketServerService');

  constructor(
    private queueService: QueueService,
    @Inject(forwardRef(() => SchedulerService)) private schedulerService: SchedulerService,
  ) {}

  @WebSocketServer()
  server: Server;

  private async authenticate(client: any): Promise<boolean> {
    return await new Promise((resolve) => {
      jwt.verify(client?.handshake?.auth?.token, SECRETE_KEY, (err: any, decoded: any) => {
        if (err) {
          resolve(false);
        }

        client.decoded = decoded;

        resolve(true);
      });
    });
  }

  private async validate(client: any): Promise<boolean> {
    let isValid = true;

    isValid = await this.authenticate(client);

    if (!isValid) {
      this.logger.error(`client ${client.id} is not valid`);
      return false;
    }

    return isValid;
  }

  private async terminate(clientId: string): Promise<void> {
    const clients = await this.server.fetchSockets();

    const target = clients.find((client) => client.id === clientId);

    if (target) {
      target.disconnect(true);
    }
  }

  async ping(clientId: string): Promise<boolean> {
    const clients = await this.server.fetchSockets();
    const client = clients.find((client) => client.id === clientId);
    return await new Promise((resolve) => {
      try {
        client.emit('ping', 'ping', (data: string) => {
          if (data === 'pong') {
            resolve(true);
          } else {
            resolve(false);
          }
        });
      } catch (error) {
        rejects(error);
      }
    });
  }

  async connectedWorkers(): Promise<string[]> {
    const workers = await this.server.fetchSockets();
    return workers.map((worker) => worker.id);
  }

  @UseGuards(SocketGuard)
  @SubscribeMessage('events')
  async handleEvent(@MessageBody() data: Event): Promise<any> {
    this.logger.verbose(`Received event from client`);
    await this.queueService.sendEvent(Queues.Events, data);
    this.logger.verbose(`Event sent to queue: ${Queues.Events}`);
    return true;
  }

  afterInit(): void {
    this.logger.log('Socket.io Server Initialized');

    this.server.use((socket, next) => {
      const isValid = this.validate(socket);

      if (isValid) {
        next();
      } else {
        socket.disconnect();
      }
    });
  }

  async handleConnection(client: any): Promise<void> {
    this.logger.log(`client connected: ${client.id}`);

    const isValid = await this.validate(client);

    if (!isValid) {
      client.disconnect();
      return;
    }

    const { uuid } = client.decoded;

    const worker = await this.schedulerService.findWorkerByUUID(uuid);

    if (worker?.identifier) {
      await this.terminate(worker.identifier);
    }

    await this.schedulerService.workerConnected(uuid, client.id);

    this.schedulerService.appendWorker({ socketId: client.id, worker });
  }

  async handleDisconnect(client: any): Promise<void> {
    const uuid = client?.decoded?.uuid;

    if (uuid) {
      this.schedulerService.workerDisconnected(uuid);
    }

    this.logger.log(`client disconnected: ${client.id}`);
  }
}
