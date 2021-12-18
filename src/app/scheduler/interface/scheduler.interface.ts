import { CronJob } from 'cron';

import { Monitor } from '../../monitor/entity/monitor.entity';

export interface JobStorage {
  expression: string;
  cron: CronJob;
  monitors: Monitor[];
}
