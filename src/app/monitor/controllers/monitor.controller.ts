import { Body, Delete, Param, Post } from '@nestjs/common';
import { AsyncStdRes } from 'src/common/types/standard-res.type';

import { BasicController } from '../../../common/basic/Basic.controller';
import { GetUser } from '../../../common/decorators/get-user.decorator';
import { UserRolePermission } from '../../../common/decorators/role-permission.decorator';
import { StandardApi } from '../../../common/decorators/standard-api.decorator';
import { User } from '../../account/entities/user.entity';
import { Role } from '../../auth/enum/role.enum';
import { SchedulerService } from '../../scheduler/services/scheduler.service';
import { CreateMonitorBodyDto } from '../dto/monitor/create-monitor.dto';
import { DeleteMonitorResDto } from '../dto/monitor/delete-monitor.dto';
import { Monitor } from '../entity/monitor.entity';
import { MonitorStatus } from '../enum/monitor.enum';
import { MonitorService } from '../services/monitor.service';

@BasicController('monitor')
export class MonitorController {
  constructor(private monitorService: MonitorService, private schedulerService: SchedulerService) {}

  // @IsOwner(Directory)
  @UserRolePermission(Role.Admin, Role.User)
  @StandardApi()
  @Post('add')
  async create(@GetUser() user: User, @Body() body: CreateMonitorBodyDto): AsyncStdRes<Monitor> {
    const monitor = await this.monitorService.createMonitor(user, body);

    if (monitor.status === MonitorStatus.Waiting) {
      this.schedulerService.assignWorkerToMonitor([monitor]);
    }

    return monitor;
  }

  @StandardApi({ type: DeleteMonitorResDto })
  // @UserRolePermission(Role.User)
  @Delete(':monitorId')
  async delete(@Param('monitorId') monitoId: number): AsyncStdRes<DeleteMonitorResDto> {
    await this.monitorService.deleteMonitor(monitoId);
    return { sucess: true };
  }
}
