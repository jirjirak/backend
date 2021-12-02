import { IsReferenceField, IsStringField } from '../../../../common/decorators/common.decorator';
import { Session } from '../../../auth/entities/session.entity';
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

  @IsReferenceField({ type: Session })
  sessions: Session[];

  @IsStringField()
  jwt: string;
}
