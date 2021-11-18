import { InjectableService } from '../../../common/decorators/common.decorator';
import { Team } from '../../account/entities/team.entity';
import { User } from '../../account/entities/user.entity';
import { CreateDirectoryPermission } from '../dto/permission/create-directory-permission.dto';
import { Permission } from '../entity/permission.entity';
import { DirectoryRepository } from '../repositories/directory.repository';
import { PermissionRepository } from '../repositories/permission.repository';

@InjectableService()
export class PermissionService {
  constructor(private permissionRepository: PermissionRepository, private directoryRepository: DirectoryRepository) {}

  async setDirectoryPermission(data: CreateDirectoryPermission): Promise<Permission> {
    const permission = await this.permissionRepository.createAndSave(data);
    return permission;
  }

  async setTeamPermission(teamId: number, userId: number) {}
}
