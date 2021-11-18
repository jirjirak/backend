import { IsPrimaryKeyField, IsStringField } from '../../../../common/decorators/common.decorator';
import { Team } from '../../../account/entities/team.entity';
import { Directory } from '../../entity/directory.entity';

export class CreateDirectoryBodyDto {
  @IsPrimaryKeyField()
  team: Team;

  @IsStringField()
  name: string;

  @IsPrimaryKeyField({ required: false })
  parent: Directory;
}

export class CreateDirectoryResDto extends Directory {}
