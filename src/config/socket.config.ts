import { ConfigService } from '@nestjs/config';
import { PORT } from './app.config';

export const SocketListenPort = +process.env.LISTEN_PORT || PORT + 1;

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export const SocketConfig = (configService: ConfigService) => {
  return {
    connectPort: configService.get<number>('CONNECT_PORT') || PORT + 1,
    host: configService.get<string>('HOST') || 'localhost',
    useSsl: configService.get<boolean>('USE_SSL') || false,
    fullUrl: configService.get<string>('FULL_URL'),
  };
};
