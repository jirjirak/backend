import { Logger } from '@nestjs/common';
import { AxiosInstance } from 'axios';

import { InjectableService } from '../../../common/decorators/common.decorator';
import { UtilsService } from '../../../common/service/utils.service';
import { Monitor } from '../../monitor/entity/monitor.entity';

@InjectableService()
export class HealthCheckService {
  logger = new Logger();

  axios: AxiosInstance;

  constructor(private utilsService: UtilsService) {
    this.axios = this.utilsService.getAxiosInstance();
  }

  private async sendHttpRequest(monitor: Monitor) {
    this.axios({
      // method: monitor.method as Method,
      url: 'https://api.doctop.com/ali',
      method: 'get',
      validateStatus: () => true,
      // timeout: monitor.timeOut,
    })
      .then((res) => {
        console.log(res.data);
      })
      .catch((e) => {
        console.log(e);
      })
      .finally(() => {});
  }

  async httpHealthCheck(monitors: Monitor[]) {
    console.log(monitors.map((m) => m.friendlyName));

    const jobTriggeredAt = this.utilsService.currentTime();

    for (const monitor of monitors) {
      this.sendHttpRequest(monitor);
    }

    const timings = {
      startAt: process.hrtime(),
      dnsLookupAt: undefined,
      tcpConnectionAt: undefined,
      tlsHandshakeAt: undefined,
      firstByteAt: undefined,
      endAt: undefined,
    };
  }
}
