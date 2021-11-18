import { IsStringField } from '../../../../common/decorators/common.decorator';
import { User } from '../../entities/user.entity';

export class RefreshBodyDto {
  @IsStringField()
  refreshToken: string;
}

export class RefreshResDto extends User {
  @IsStringField()
  firstName: string;

  @IsStringField()
  lastName: string;

  @IsStringField()
  displayName: string;

  @IsStringField()
  jwt: string;
}
