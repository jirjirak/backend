import { Get, Query } from '@nestjs/common';
import { BasicController } from 'src/common/basic/Basic.controller';
import { StandardApi } from 'src/common/decorators/standard-api.decorator';
import { AsyncStdRes } from 'src/common/types/standard-res.type';
import { isMicroserviceArchitecture } from 'src/config/app.config';
import { FindWorkerResDto, FindWorkersQueryDto } from '../dto/manage-worker.controller/find.dto';
import { WorkerStatus } from '../enum/worker.enum';
import { ManageWorkerService } from '../services/manage-worker.service';

@BasicController('worker', true)
export class ManageWorkerController {
  constructor(private manageWorkerService: ManageWorkerService) {}

  @StandardApi({ type: FindWorkerResDto })
  @Get()
  async findWorkers(@Query() query: FindWorkersQueryDto): AsyncStdRes<FindWorkerResDto[]> {
    if (isMicroserviceArchitecture) {
      const [workers, total] = await this.manageWorkerService.findWorkers(query);
      return { data: workers as any, meta: { total } };
    } else {
      return {
        data: [
          {
            friendlyName: 'local worker',
            ipv4: '',
            ipv6: '',
            id: 1,
            uuid: '',
            monitorCount: 0,
            status: WorkerStatus.Active,
          } as any,
        ],
        meta: { total: 1 },
      };
    }
  }
}
