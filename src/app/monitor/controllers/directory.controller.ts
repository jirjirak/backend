import { BadRequestException, Body, Get, Post } from '@nestjs/common';

import { BasicController } from '../../../common/basic/Basic.controller';
import { IsOwner } from '../../../common/decorators/is-owner.decorator';
import { UserRolePermission } from '../../../common/decorators/role-permission.decorator';
import { StandardApi } from '../../../common/decorators/standard-api.decorator';
import { Role } from '../../auth/enum/role.enum';
import { CreateDirectoryBodyDto, CreateDirectoryResDto } from '../dto/directory/create.dto';
import { DirectoryLisRestDto } from '../dto/directory/list.dto';
import { Directory } from '../entity/directory.entity';
import { DirectoryService } from '../services/directory.service';

@BasicController('directory')
export class DirectoryController {
  constructor(private directoryService: DirectoryService) {}

  @IsOwner(Directory, { sourcePkField: 'parent' })
  @UserRolePermission(Role.User, Role.Admin)
  @StandardApi({ type: CreateDirectoryResDto })
  @Post()
  async create(@Body() body: CreateDirectoryBodyDto): Promise<Directory> {
    const { name, parent, team } = body;

    const directoryNameUniq = await this.directoryService.IsDirectoryNameUniq(team, name);

    if (!directoryNameUniq) {
      throw new BadRequestException('Directory name is not uniq');
    }

    const directory = await this.directoryService.create(team, name, parent);

    return directory;
  }

  @StandardApi({ type: DirectoryLisRestDto })
  @Get()
  async list(): Promise<Directory[]> {
    const directories = await this.directoryService.list();
    return directories;
  }
}
