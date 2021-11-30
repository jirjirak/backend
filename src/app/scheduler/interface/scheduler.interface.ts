import { CronJob } from 'cron';

import { Monitor } from '../../monitor/entity/monitor.entity';
import { MonitorType } from '../../monitor/enum/monitor.enum';

export interface JobStorage {
  expression: string;
  cron: CronJob;
  type: MonitorType;
}
