import { ConfigService } from '@nestjs/config';

export enum TransmitterStrategy {
  Socket = 'socket',
  Grpc = 'grpc',
}

interface TransmitterConfigResult {
  strategy: TransmitterStrategy;
}

export const TransmitterConfig = (configService: ConfigService): TransmitterConfigResult => {
  return {
    strategy: configService.get<TransmitterStrategy>('TRANSMITTER_STRATEGY'),
  };
};
