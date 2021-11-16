import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { DirectoryController } from './controllers/directory.controller';
import { DirectoryRepository } from './repositories/directory.repository';
import { DirectoryService } from './services/directory.service';

@Module({
  imports: [TypeOrmModule.forFeature([DirectoryRepository])],
  controllers: [DirectoryController],
  providers: [DirectoryService],
})
export class MonitorModule {}
