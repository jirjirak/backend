import { Logger, ValidationPipe, VersioningType } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { CronJob } from 'cron';
import compression from 'fastify-compress';
import * as helmet from 'fastify-helmet';

import { AppModule } from './app.module';
import './app/scheduler/services/scheduler.service';
import { SchedulerService } from './app/scheduler/services/scheduler.service';
import { MyLogger } from './common/basic/logger.basic';
import { BootstrapService } from './common/service/bootstrap.service';
import { setupSwagger } from './plugin/swagger.plugin';

const logger = new Logger('main');

async function bootstrap() {
  // await NestFactory.createMicroservice<MicroserviceOptions>(AppModule, {
  //   transport: Transport.REDIS,
  //   options: {
  //     url: 'redis://localhost:6379',
  //   },
  // });

  const app = await NestFactory.create<NestFastifyApplication>(AppModule, new FastifyAdapter(), {
    // logger: new MyLogger(),
    // bufferLogs: true,
  });

  app.enableVersioning({
    type: VersioningType.URI,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: false,
    }),
  );

  app.register(compression, { encodings: ['gzip', 'deflate'] });

  app.register(helmet.fastifyHelmet, {
    contentSecurityPolicy: {
      directives: {
        defaultSrc: [`'self'`],
        styleSrc: [`'self'`, `'unsafe-inline'`],
        imgSrc: [`'self'`, 'data:', 'validator.swagger.io'],
        scriptSrc: [`'self'`, `https: 'unsafe-inline'`],
      },
    },
  });

  await app.startAllMicroservices();

  const bootstrapService = app.get<BootstrapService>(BootstrapService);

  // bootstrapService.setupSwagger(app);

  setupSwagger(app);

  await app.listen(3000, '0.0.0.0');

  const a = app.get(SchedulerService);

  // a.addJob();
  // a.addJob();
  // a.addJob();
  // a.addJob();

  logger.log(`Application is running on: ${await app.getUrl()}`);
  logger.log(`Swagger is running on: ${await app.getUrl()}/v1/swagger`);
}
bootstrap();
