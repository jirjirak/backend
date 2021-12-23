import { Module } from '@nestjs/common';
import { DeterminerService } from './services/determiner.service';

@Module({ providers: [DeterminerService], exports: [DeterminerService] })
export class DeterminerModule {}
