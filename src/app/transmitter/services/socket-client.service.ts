import { Socket } from 'socket.io-client';
import { InjectableService } from 'src/common/decorators/common.decorator';
import { io } from 'socket.io-client';
import { Event } from 'src/app/event/entities/event.entity';
import { Logger } from '@nestjs/common';

@InjectableService()
export class SocketClientService {
  socket: Socket;

  logger = new Logger('SocketClientService');

  init(): void {
    const socket = io('http://localhost:5050');
    this.socket = socket;
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

  async sendEvent(event: any): Promise<boolean> {
    const res = await this.send(event);
    return res;
  }
}
