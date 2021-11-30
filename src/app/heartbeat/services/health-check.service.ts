import { Logger } from '@nestjs/common';
import axios from 'axios';

import { InjectableService } from '../../../common/decorators/common.decorator';

@InjectableService()
export class HealthCheckService {
  logger = new Logger();

  async httpHealthCheck() {
    // const response = await axios.all([axios.get('https://google.com')]);
    // console.log(+new Date());
    // return response.every((r) => r.status === 200);
  }
}
