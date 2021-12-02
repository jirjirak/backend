import { Logger } from '@nestjs/common';
import { AxiosInstance } from 'axios';

import { InjectableService } from '../../../common/decorators/common.decorator';
import { EventHandlerService } from '../../event/services/event-handler.service';
import { UtilsService } from '../../../common/service/utils.service';
import { Monitor } from '../../monitor/entity/monitor.entity';
import { Queue } from 'bull';
import { InjectQueue } from '@nestjs/bull';

@InjectableService()
export class HealthCheckService {
  logger = new Logger();

  axios: AxiosInstance;

  constructor(private utilsService: UtilsService) {
    this.axios = this.utilsService.getAxiosInstance();
  }

  private async sendHttpRequest(monitor: Monitor): Promise<void> {
    this.axios({
      // method: monitor.method as Method,
      url: 'https://api.doctop.com/ali',
      method: 'get',
      validateStatus: () => true,
      // timeout: monitor.timeOut,
    })
      .then((res) => {
        // console.log(res.data);
      })
      .catch((e) => {
        // console.log(e);
      });
  }

  async httpHealthCheck(monitors: Monitor[]): Promise<void> {
    console.log(monitors.map((m) => m.friendlyName));

    const jobTriggeredAt = this.utilsService.currentTime();

    for (const monitor of monitors) {
      this.sendHttpRequest(monitor);
    }
  }
}
