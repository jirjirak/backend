// Bull.QueueOptions;

import { ConfigService } from '@nestjs/config';
import * as Bull from 'bull';
import { redisConfig } from './redis.config';

export function BullConfig(configService: ConfigService): Bull.QueueOptions {
  const redis = redisConfig(configService);
  return {
    redis: {
      ...redis,
    },
  };
}
