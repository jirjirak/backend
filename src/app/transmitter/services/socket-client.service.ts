import { Socket } from 'socket.io-client';
import { InjectableService } from 'src/common/decorators/common.decorator';
import { io } from 'socket.io-client';
import { Event } from 'src/app/event/entities/event.entity';
import { Logger } from '@nestjs/common';
import { isWorkerMode } from 'src/config/app.config';

@InjectableService()
export class SocketClientService {
  private socket: Socket;
  private logger = new Logger('SocketClientService');

  init(): void {
    if (!isWorkerMode) {
      return;
    }
    const socket = io('http://localhost:5050');
    this.socket = socket;

    this.logger.log('socket client initialized');
  }

  private async send(event: Event): Promise<any> {
    return await new Promise((resolve, reject) => {
      try {
        this.socket.emit('events', event, (res: any) => {
          return resolve(res);
        });
      } catch (e) {
        return reject(e);
      }
    });
  }

  async sendEvent(event: Event): Promise<boolean> {
    if (!isWorkerMode) {
      return;
    }
    this.logger.verbose(`send event: ${event.uuid}`);

    const res = await this.send(event);

    this.logger.verbose(`event ${event.uuid} sent`);

    return res;
  }
}
