import { INestApplication, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { isEmpty } from 'class-validator';
import { writeFileSync } from 'fs';

import { Monitor } from '../../app/monitor/entity/monitor.entity';
import { MonitorService } from '../../app/monitor/services/monitor.service';
import { SchedulerService } from '../../app/scheduler/services/scheduler.service';

@Injectable()
export class BootstrapService {
  logger = new Logger('Bootstrap');

  constructor(
    private configService: ConfigService,
    private monitorService: MonitorService,
    private schedulerService: SchedulerService,
  ) {}

  async generateSecreteKey() {
    const secreteKey = this.configService.get<string>('SECRETE_KEY');

    if (!secreteKey) {
      writeFileSync('../../../SECRETE_KEY', '');
    }
  }

  setupSwagger(app: INestApplication) {
    const config = new DocumentBuilder()
      .setTitle('JirJirak')
      .setDescription('JirJirak Api Document')
      .setVersion('1')
      .addBearerAuth()
      .build();

    const document = SwaggerModule.createDocument(app, config);

    SwaggerModule.setup('/v1/swagger', app, document);
  }

  async loadMonitors() {
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

      await this.schedulerService.ProcessMonitors(monitors);

      currentPage += 1;
    }

    this.logger.log(`Monitors loaded`);
  }
}
