import { DataCenter } from 'src/app/data-center/entities/data-center.entity';
import { IsNumberField, IsPrimaryKeyField, IsStringField } from 'src/common/decorators/common.decorator';
import { Worker } from '../../entities/worker.entity';

export class RegisterWorkerBodyDto {
  @IsStringField()
  friendlyName: string;

  @IsPrimaryKeyField()
  dataCenter: DataCenter;
}

export class RegisterWorkerResDto {
  @IsStringField()
  friendlyName: string;

  @IsStringField()
  uuid: string;

  @IsNumberField()
  capacity: number;

  @IsStringField()
  token: string;
}
