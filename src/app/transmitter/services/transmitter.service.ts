import { Logger } from '@nestjs/common';
import { DeterminerService } from 'src/app/determiner/services/determiner.service';
import { Event } from 'src/app/event/entities/event.entity';
import { InjectableService } from 'src/common/decorators/common.decorator';
import { TransmitterStrategy } from 'src/config/transmitter.config';
import { SocketClientService } from './socket-client.service';

@InjectableService()
export class TransmitterService {
  logger = new Logger('TransmitterService');

  constructor(private determinerService: DeterminerService, private socketService: SocketClientService) {}

  async sendEvent(event: Event): Promise<boolean> {
    const transmitterStrategy = this.determinerService.transmitterStrategy();
    let ack: boolean;

    if (transmitterStrategy === TransmitterStrategy.Socket) {
      ack = await this.socketService.sendEvent(event);
    }

    if (ack) {
      this.logger.log(`Event sent`);
    } else {
      this.logger.error(`Event not sent`);
    }

    return ack;
  }
}
