import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
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
}
