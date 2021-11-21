import { OmitType } from '@nestjs/swagger';
import { Max, Min } from 'class-validator';

import {
  IsEnumField,
  IsNumberField,
  IsPrimaryKeyField,
  IsStringField,
} from '../../../../common/decorators/common.decorator';
import { User } from '../../../account/entities/user.entity';
import { Directory } from '../../entity/directory.entity';
import { Monitor } from '../../entity/monitor.entity';
import { MonitorStatus, MonitorType } from '../../enum/monitor.enum';

export class CreateMonitorBodyDto extends OmitType(Monitor, ['id']) {
  @IsStringField()
  address: string;

  @IsPrimaryKeyField()
  directory: Directory;

  @IsEnumField({ type: MonitorType })
  type: MonitorType;

  @IsStringField()
  friendlyName: string;

  @Max(60000)
  @Min(1000)
  @IsNumberField()
  interval: 10000;

  @IsPrimaryKeyField()
  creator: User;

  @IsEnumField({ type: MonitorStatus })
  status: MonitorStatus;

  @Max(1000)
  @Min(0)
  @IsNumberField()
  errorTolerance: number;
}
