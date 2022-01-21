import { Team } from 'src/app/account/entities/team.entity';
import { IsPrimaryKeyField, IsStringField } from 'src/common/decorators/common.decorator';
import { DataCenter } from '../../entities/data-center.entity';

export class FindDataCenterQueryDto {
  @IsPrimaryKeyField({ type: Team })
  teams: Team[];
}

export class FindDataCenterResDto extends DataCenter {
  @IsStringField()
  name: string;

  @IsStringField()
  country: string;

  @IsStringField()
  city: string;

  @IsStringField()
  isPrivate: boolean;
}
