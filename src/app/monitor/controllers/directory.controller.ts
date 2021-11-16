import { Body, Get, Post } from '@nestjs/common';
import { AzureActiveDirectoryServicePrincipalSecret } from 'typeorm/driver/sqlserver/authentication/AzureActiveDirectoryServicePrincipalSecret';

import { BasicController } from '../../../common/basic/Basic.controller';
import { StandardApi } from '../../../common/decorators/standard-api.decorator';
import { CreateDirectoryBodyDto, CreateDirectoryResDto } from '../dto/directory/create.dto';
import { DirectoryLisRestDto } from '../dto/directory/list.dto';
import { Directory } from '../entity/directory.entity';
import { DirectoryService } from '../services/directory.service';

@BasicController('directory')
export class DirectoryController {
  constructor(private directoryService: DirectoryService) {}

  @StandardApi({ type: CreateDirectoryResDto })
  @Post()
  async create(@Body() body: CreateDirectoryBodyDto): Promise<Directory> {
    const { name, parentId } = body;
    const directory = await this.directoryService.create({ id: 1 } as any, name, parentId);
    return directory;
  }

  @StandardApi({ type: DirectoryLisRestDto })
  @Get()
  async list(): Promise<Directory[]> {
    const directories = await this.directoryService.list();
    return directories;
  }
}
