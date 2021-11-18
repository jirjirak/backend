import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { DirectoryController } from './controllers/directory.controller';
import { DirectoryRepository } from './repositories/directory.repository';
import { PermissionRepository } from './repositories/permission.repository';
import { DirectoryService } from './services/directory.service';

@Module({
  imports: [TypeOrmModule.forFeature([DirectoryRepository, PermissionRepository])],
  controllers: [DirectoryController],
  providers: [DirectoryService],
})
export class MonitorModule {}
