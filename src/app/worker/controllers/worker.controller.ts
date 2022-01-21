import { Body, Get, Post, Query } from '@nestjs/common';
import { User } from 'src/app/account/entities/user.entity';
import { Role } from 'src/app/auth/enum/role.enum';
import { BasicController } from 'src/common/basic/Basic.controller';
import { GetUser } from 'src/common/decorators/get-user.decorator';
import { UserRolePermission } from 'src/common/decorators/role-permission.decorator';
import { StandardApi } from 'src/common/decorators/standard-api.decorator';
import { AsyncStdRes } from 'src/common/types/standard-res.type';
import { isMicroserviceArchitecture } from 'src/config/app.config';
import { FindWorkerResDto, FindWorkersQueryDto } from '../dto/manage-worker.controller/find.dto';
import { RegisterWorkerBodyDto, RegisterWorkerResDto } from '../dto/manage-worker.controller/register-worker.dto';
import { WorkerStatus } from '../enum/worker.enum';
import { ManageWorkerService } from '../services/manage-worker.service';

@BasicController('worker')
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

    @UserRolePermission()
  @StandardApi({ type: RegisterWorkerResDto })
  @Post('register')
  async registerWorker(@GetUser() user: User, @Body() body: RegisterWorkerBodyDto): AsyncStdRes<RegisterWorkerResDto> {
    const newWorker = await this.manageWorkerService.registerWorker(user, body);
    const token = await this.manageWorkerService.createJwt(newWorker);

    return { data: { ...newWorker, token } };
  }
}
