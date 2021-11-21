import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { DirectoryController } from './controllers/directory.controller';
import { MonitorController } from './controllers/monitor.controller';
import { DirectoryRepository } from './repositories/directory.repository';
import { MonitorRepository } from './repositories/monitor.repository';
import { PermissionRepository } from './repositories/permission.repository';
import { DirectoryService } from './services/directory.service';
import { MonitorService } from './services/monitor.service';

@Module({
  imports: [TypeOrmModule.forFeature([DirectoryRepository, PermissionRepository, MonitorRepository])],
  controllers: [DirectoryController, MonitorController],
  providers: [DirectoryService, MonitorService],
})
export class MonitorModule {}
