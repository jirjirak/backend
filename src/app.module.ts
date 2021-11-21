import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AccountModule } from './app/account/account.module';
import { AuthModule } from './app/auth/auth.module';
import { EventModule } from './app/event/event.module';
import { MonitorModule } from './app/monitor/monitor.module';
import { SchedulerModule } from './app/scheduler/scheduler.module';
import { TagModule } from './app/tag/tag.module';
import { CommonModule } from './common/common.module';
import { typeOrmCOnfig } from './config/typeorm.config';
import { DatacenterModule } from './datacenter/datacenter.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => typeOrmCOnfig(configService),
    }),
    AuthModule,
    CommonModule,
    AccountModule,
    TagModule,
    MonitorModule,
    SchedulerModule,
    EventModule,
    DatacenterModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
