
import { IsBooleanField, IsPrimaryKeyField } from '../../../../common/decorators/common.decorator';
import { Team } from '../../../account/entities/team.entity';
import { User } from '../../../account/entities/user.entity';
import { Directory } from '../../entity/directory.entity';

export class CreateDirectoryPermission {
  @IsPrimaryKeyField()
  directory: Directory;

  @IsPrimaryKeyField()
  team: Team;

  @IsPrimaryKeyField()
  user: User;

  @IsBooleanField()
  delete: boolean;

  @IsBooleanField()
  read: boolean;

  @IsBooleanField()
  update: boolean;

  @IsBooleanField()
  create: boolean;
}
