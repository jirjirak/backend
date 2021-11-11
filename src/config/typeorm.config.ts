import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export function typeOrmCOnfig(
  configService: ConfigService,
): TypeOrmModuleOptions {
  return {
    type: 'postgres',
    host: configService.get<string>('DATABASE_HOST') || '127.0.0.1',
    port: configService.get<number>('DATABASE_PORT') || 5432,
    username: configService.get<string>('DATABASE_USERNAME') || 'postgres',
    password: configService.get<string>('DATABASE_PASSWORD') || 'postgres',
    database: configService.get<string>('DATABASE_NAME') || 'jirjirak',
    autoLoadEntities: true,
    entities: ['dist/**/*.entity{.ts,.js}'],
    synchronize: true,
    logging: true,
  };
}
