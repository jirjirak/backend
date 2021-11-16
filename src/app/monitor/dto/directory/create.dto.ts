import { IsPrimaryKeyField, IsStringField } from '../../../../common/decorators/common.decorator';
import { Directory } from '../../entity/directory.entity';

export class CreateDirectoryBodyDto {
  @IsStringField()
  name: string;

  @IsPrimaryKeyField()
  parentId: Directory;
}

export class CreateDirectoryResDto extends Directory {}
