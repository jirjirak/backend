import { Post } from '@nestjs/common';

import { BasicController } from '../../../common/basic/Basic.controller';
import { MonitorService } from '../services/monitor.service';

@BasicController('monitor')
export class MonitorController {
  constructor(private monitorService: MonitorService) {}

  @Post()
  async create() {
    const monitor = await this.monitorService.createMonitor({ id: 7 } as any);
    return monitor;
  }
}
