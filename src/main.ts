import { Logger, ValidationPipe, VersioningType } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import compression from 'fastify-compress';
import * as helmet from 'fastify-helmet';

import { createBullBoard } from '@bull-board/api';
import { BullAdapter } from '@bull-board/api/bullAdapter';
import * as Queue from 'bull';

import { FastifyAdapter as BullFastifyAdapter } from '@bull-board/fastify';

import { AppModule } from './app.module';
import './app/scheduler/services/scheduler.service';
import { BootstrapService } from './common/service/bootstrap.service';
import { setupSwagger } from './plugin/swagger.plugin';

const logger = new Logger('main');

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create<NestFastifyApplication>(AppModule, new FastifyAdapter(), {});

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.REDIS,
    options: {
      url: 'redis://localhost:6379',
    },
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

  const bootstrapService = app.get<BootstrapService>(BootstrapService);

  await bootstrapService.initBefore();

  setupSwagger(app);

  const bullServerAdapter = new BullFastifyAdapter();

  createBullBoard({
    queues: [new BullAdapter(new Queue('events'))],
    serverAdapter: bullServerAdapter,
  });

  bullServerAdapter.setBasePath('/admin/queues');

  app.register(bullServerAdapter.registerPlugin(), {
    prefix: '/admin/queues',
    basePath: '/admin/queues',
  });

  await app.startAllMicroservices();

  await app.listen(3000, '0.0.0.0');

  await bootstrapService.loadMonitors();

  logger.log(`Application is running on: ${await app.getUrl()}`);
  logger.log(`Swagger is running on: ${await app.getUrl()}/v1/swagger`);
}
bootstrap();
