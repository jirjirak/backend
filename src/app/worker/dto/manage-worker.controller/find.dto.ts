import { IsEnum } from 'class-validator';
import { IsEnumField, IsNumberField, IsStringField } from 'src/common/decorators/common.decorator';
import { Worker } from '../../entities/worker.entity';
import { WorkerStatus } from '../../enum/worker.enum';

export class FindWorkersQueryDto {
  @IsNumberField()
  page: number;

  @IsEnumField(WorkerStatus, { required: false })
  status: WorkerStatus;

  @IsStringField({ required: false })
  friendlyName: string;
}

export class FindWorkerResDto extends Worker {
  @IsStringField()
  friendlyName: string;

  @IsStringField()
  ipv4: string;

  @IsStringField()
  ipv6: string;

  @IsEnumField(WorkerStatus)
  status: WorkerStatus;

  @IsNumberField()
  monitorCount: number;
}
