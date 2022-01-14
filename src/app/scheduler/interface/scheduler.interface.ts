import { CronJob } from 'cron';
import { Worker } from 'src/app/worker/entities/worker.entity';

import { Monitor } from '../../monitor/entity/monitor.entity';

export interface JobStorage {
  expression: string;
  cron: CronJob;
  monitors: Monitor[];
}

export interface ActiveWorkers {
  socketId: string;
  worker: Worker;
}
