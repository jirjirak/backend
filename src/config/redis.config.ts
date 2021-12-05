import { ConfigService } from '@nestjs/config';

interface RedisConfig {
  host: string;
  port: number;
  password: string;
  db: number;
}

export function redisConfig(configService: ConfigService): RedisConfig {
  return {
    host: configService.get<string>('REDIS_HOST') || '127.0.0.1',
    port: configService.get<number>('REDIS_PORT') || 6379,
    password: configService.get<string>('REDIS_PASSWORD') || undefined,
    db: configService.get<number>('REDIS_DB') || 0,
  };
}
