import { Event } from 'src/app/event/entities/event.entity';
import { InjectableService } from 'src/common/decorators/common.decorator';

@InjectableService()
export class TransmitterService {
  async sendEvent(event: Event) {}
}
