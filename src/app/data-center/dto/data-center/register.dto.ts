import { Team } from 'src/app/account/entities/team.entity';
import { Tag } from 'src/app/tag/entities/tag.entity';
import {
  IsBooleanField,
  IsEnumField,
  IsPrimaryKeyField,
  IsReferenceField,
  IsStringField,
} from 'src/common/decorators/common.decorator';
import { DataCenter } from '../../entities/data-center.entity';
import { DataCenterStatus } from '../../enum/data-center.enum';

export class RegisterDataCenterBodyDto {
  @IsStringField()
  city: string;

  @IsStringField()
  country: string;

  @IsStringField()
  name: string;

  @IsBooleanField()
  isPrivate: boolean;

  @IsStringField()
  description: string;

  @IsPrimaryKeyField({ type: Tag, required: false })
  tags: Tag[];

  @IsEnumField(DataCenterStatus)
  status: DataCenterStatus;

  @IsPrimaryKeyField({ type: Team, required: false })
  teams: Team[];
}

export class RegisterDataCenterResDto extends DataCenter {
  @IsStringField()
  city: string;

  @IsStringField()
  country: string;

  @IsStringField()
  name: string;

  @IsBooleanField()
  isPrivate: boolean;

  @IsStringField()
  description: string;

  @IsEnumField(DataCenterStatus)
  status: DataCenterStatus;

  @IsReferenceField({ type: Tag })
  tags: Tag[];

  @IsReferenceField({ type: Team })
  teams: Team[];
}
