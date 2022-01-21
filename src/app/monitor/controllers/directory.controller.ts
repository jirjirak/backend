import { BadRequestException, Body, Get, Post, Query } from '@nestjs/common';
import { User } from 'src/app/account/entities/user.entity';
import { GetUser } from 'src/common/decorators/get-user.decorator';

import { BasicController } from '../../../common/basic/Basic.controller';
import { UserRolePermission } from '../../../common/decorators/role-permission.decorator';
import { StandardApi } from '../../../common/decorators/standard-api.decorator';
import { Role } from '../../auth/enum/role.enum';
import { CreateDirectoryBodyDto, CreateDirectoryResDto } from '../dto/directory/create.dto';
import { DirectoryLisRestDto, DirectoryListQueryDto } from '../dto/directory/list.dto';
import { Directory } from '../entity/directory.entity';
import { DirectoryService } from '../services/directory.service';

@BasicController('directory')
export class DirectoryController {
  constructor(private directoryService: DirectoryService) {}

  @UserRolePermission(Role.User, Role.Admin)
  @StandardApi({ type: CreateDirectoryResDto })
  @Post()
  async create(@GetUser() user: User, @Body() body: CreateDirectoryBodyDto): Promise<Directory> {
    const { name, parent, team } = body;

    const directoryNameUniq = await this.directoryService.IsDirectoryNameUniq(team, name);

    if (!directoryNameUniq) {
      throw new BadRequestException('Directory name is not uniq');
    }

    const directory = await this.directoryService.create(team, user, name, parent);

    return directory;
  }

  @UserRolePermission(Role.User, Role.Admin)
  @StandardApi({ type: DirectoryLisRestDto })
  @Get()
  async list(@GetUser() user: User, @Query() query: DirectoryListQueryDto): Promise<Directory[]> {
    const { team } = query;
    const directories = await this.directoryService.list(team.id, user.id);
    return directories;
  }
}
