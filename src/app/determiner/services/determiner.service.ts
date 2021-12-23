import { ConfigService } from '@nestjs/config';
import { InjectableService } from 'src/common/decorators/common.decorator';
import { TransmitterConfig, TransmitterStrategy } from 'src/config/transmitter.config';

@InjectableService()
export class DeterminerService {
  constructor(private configService: ConfigService) {}

  transmitterStrategy(): TransmitterStrategy {
    const transmitterConfig = TransmitterConfig(this.configService);

    if (!transmitterConfig.strategy) {
      transmitterConfig.strategy = TransmitterStrategy.Socket;
    }

    return transmitterConfig.strategy;
  }
}
