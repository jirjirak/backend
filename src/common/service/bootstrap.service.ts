import { INestApplication, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { writeFileSync } from 'fs';

@Injectable()
export class BootstrapService {
  constructor(private configService: ConfigService) {}

  async generateSecreteKet() {
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
      .build();

    const document = SwaggerModule.createDocument(app, config);

    SwaggerModule.setup('/v1/swagger', app, document);
  }
}
