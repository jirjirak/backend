import { Socket } from 'socket.io-client';
import { InjectableService } from 'src/common/decorators/common.decorator';
import { io } from 'socket.io-client';
import { Event } from 'src/app/event/entities/event.entity';
import { Logger } from '@nestjs/common';
import { isWorkerMode } from 'src/config/app.config';
import { ConfigService } from '@nestjs/config';
import { SocketConfig } from 'src/config/socket.config';

@InjectableService()
export class SocketClientService {
  private socket: Socket;
  private logger = new Logger('SocketClientService');

  constructor(private configService: ConfigService) {}

  async init(): Promise<void> {
    if (!isWorkerMode) {
      return;
    }

    const config = SocketConfig(this.configService);

    const socket = io(config.fullUrl || `${config.useSsl ? 'https' : 'http'}://${config.host}:${config.connectPort}`, {
      auth: {
        token:
          'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1dWlkIjoiN2YyNzgzNzctMTY5Yi00ZDQ5LWEyNTMtZjBkOTlhZTg3Njg0IiwiaWF0IjoxNjQyMTY3OTc1fQ.Wi-Y7Y3ol797etN7ABuAvSJ5V5m0c2PLqRlLf4NHTJk',
      },
    });

    this.socket = socket;

    this.afterInit(socket);

    this.logger.log('socket client initialized');
  }

  async afterInit(socket: Socket): Promise<void> {
    socket.on('ping', async (data, callback) => {
      if (data === 'ping') {
        callback('pong');
      } else {
        callback('mong');
      }
    });
  }

  private async send(data: any, channel: string): Promise<any> {
    return await new Promise((resolve, reject) => {
      try {
        this.socket.emit(channel, data, (res: any) => {
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

    const res = await this.send(event, 'events');

    this.logger.verbose(`event ${event.uuid} sent`);

    return res;
  }
}
