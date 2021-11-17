import { IsReferenceField, IsStringField } from '../../../../common/decorators/common.decorator';
import { Team } from '../../entities/team.entity';
import { User } from '../../entities/user.entity';

export class LoginBodyDto {
  @IsStringField()
  email: string;

  @IsStringField()
  password: string;
}

export class LoginResDto extends User {
  @IsStringField()
  firstName: string;

  @IsStringField()
  lastName: string;

  @IsStringField()
  displayName: string;

  @IsStringField()
  jwt: string;
}
