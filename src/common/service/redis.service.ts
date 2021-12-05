import { ConfigService } from '@nestjs/config';
import * as Redis from 'ioredis';
import { redisConfig } from '../../config/redis.config';

import { InjectableService } from '../decorators/common.decorator';

@InjectableService()
export class RedisService {
  redis: Redis.Redis;

  constructor(private configService: ConfigService) {}

  init(): void {
    const setting = redisConfig(this.configService);

    this.redis = new Redis({
      ...setting,
    });
  }

  async get(key: string): Promise<any> {
    const value: any = await this.redis.get(key);
    return JSON.parse(value);
  }

  async set(key: string, value: any, ttl = 1 * 60 * 15): Promise<any> {
    const result = await this.redis.set(key, JSON.stringify(value), 'EX', ttl);
    return result;
  }

  async del(key: string): Promise<any> {
    const value = await this.redis.del(key);
    return value;
  }

  async reset(pattern: string): Promise<void> {
    const keys = await this.redis.keys(pattern);
    keys.forEach((key) => {
      this.del(key);
    });
  }

  async resetAll(): Promise<void> {
    const keys = await this.redis.keys('*');
    keys.forEach((key) => {
      this.del(key);
    });
  }

  async resetKeys(keys: string[]): Promise<void> {
    for (const key of keys) {
      await this.reset('*' + key + '*');
    }
  }
}
