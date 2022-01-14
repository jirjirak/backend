import { INestApplication, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { isEmpty } from 'class-validator';
import { writeFileSync } from 'fs';
import { TransmitterService } from 'src/app/transmitter/services/transmitter.service';

import { Monitor } from '../../app/monitor/entity/monitor.entity';
import { MonitorService } from '../../app/monitor/services/monitor.service';
import { SchedulerService } from '../../app/scheduler/services/scheduler.service';
import { RedisService } from './redis.service';

@Injectable()
export class BootstrapService {
  logger = new Logger('Bootstrap');

  constructor(
    private configService: ConfigService,
    private monitorService: MonitorService,
    private schedulerService: SchedulerService,
    private redisService: RedisService,
    private transmitterService: TransmitterService,
  ) {}

  async generateSecreteKey(): Promise<void> {
    const secreteKey = this.configService.get<string>('SECRETE_KEY');

    if (!secreteKey) {
      writeFileSync('../../../SECRETE_KEY', '');
    }
  }

  setupSwagger(app: INestApplication): void {
    const config = new DocumentBuilder()
      .setTitle('JirJirak')
      .setDescription('JirJirak Api Document')
      .setVersion('1')
      .addBearerAuth()
      .build();

    const document = SwaggerModule.createDocument(app, config);

    SwaggerModule.setup('/v1/swagger', app, document);
  }

  private async initializeService(): Promise<void> {
    this.redisService.init();
  }

  async loadMonitors(): Promise<void> {
    let monitors: Monitor[];

    this.logger.log(`loading Monitors`);

    const totalMonitors = await this.monitorService.countMonitors();

    const limit = 1000;
    const totalPages = Math.floor(totalMonitors / limit) + 1;

    let currentPage = 1;
    while (currentPage <= totalPages) {
      monitors = await this.monitorService.bootstrapLoadMonitor(currentPage);

      if (isEmpty(monitors)) {
        break;
      }

      await this.schedulerService.assignWorkerToMonitor(monitors);

      currentPage += 1;
    }

    this.logger.log(`Monitors loaded`);
  }

  async initBefore(): Promise<void> {
    await this.initializeService();

    // load monitors
    // await this.loadMonitors();
  }
}
