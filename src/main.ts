import { Logger, ValidationPipe, VersioningType } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import compression from 'fastify-compress';
import * as helmet from 'fastify-helmet';

import { AppModule } from './app.module';
import './app/scheduler/services/scheduler.service';
import { BootstrapService } from './common/service/bootstrap.service';
import { setupSwagger } from './plugin/swagger.plugin';

const logger = new Logger('main');

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(AppModule, new FastifyAdapter());

  // await NestFactory.createMicroservice<MicroserviceOptions>({
  //   transport: Transport.REDIS,
  //   options: {
  //     url: 'redis://localhost:6379',
  //   },
  // });

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

  await bootstrapService.loadMonitors();

  await app.listen(3000, '0.0.0.0');

  logger.log(`Application is running on: ${await app.getUrl()}`);
  logger.log(`Swagger is running on: ${await app.getUrl()}/v1/swagger`);
}
bootstrap();
