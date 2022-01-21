import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataCenterController } from './controllers/data-center.controller';
import { DataCenterRepository } from './repositories/data-center.repository';
import { DataCenterService } from './services/data-center.service';

@Module({
  imports: [TypeOrmModule.forFeature([DataCenterRepository])],
  controllers: [DataCenterController],
  providers: [DataCenterService],
})
export class DataCenterModule {}
