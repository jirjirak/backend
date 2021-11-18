import { IsBooleanField, IsStringField } from '../../../../common/decorators/common.decorator';
import { User } from '../../entities/user.entity';

export class WhoAmIResDto extends User {
  @IsStringField()
  email: string;

  @IsStringField()
  displayName: string;

  @IsStringField()
  firstName: string;

  @IsStringField()
  lastName: string;

  @IsBooleanField()
  isSystemAdmin: boolean;

  @IsBooleanField()
  isSystemOwner: boolean;
}
