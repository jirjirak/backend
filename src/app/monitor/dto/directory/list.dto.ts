import { IsReferenceField, IsStringField } from '../../../../common/decorators/common.decorator';
import { Directory } from '../../entity/directory.entity';
import { Monitor } from '../../entity/monitor.entity';
import { Permission } from '../../entity/permission.entity';

export class DirectoryLisRestDto extends Directory {
  @IsStringField()
  name: string;

  @IsReferenceField({ type: DirectoryLisRestDto })
  children: DirectoryLisRestDto[];

  @IsReferenceField({ type: Monitor })
  monitors: Monitor[];

  @IsReferenceField({ type: Permission })
  permissions: Permission[];
}
