import { Body, Post } from '@nestjs/common';

import { BasicController } from '../../../common/basic/Basic.controller';
import { GetUser } from '../../../common/decorators/get-user.decorator';
import { UserRolePermission } from '../../../common/decorators/role-permission.decorator';
import { StandardApi } from '../../../common/decorators/standard-api.decorator';
import { User } from '../../account/entities/user.entity';
import { Role } from '../../auth/enum/role.enum';
import { SchedulerService } from '../../scheduler/services/scheduler.service';
import { CreateMonitorBodyDto } from '../dto/monitor/create-monitor.dto';
import { MonitorStatus } from '../enum/monitor.enum';
import { MonitorService } from '../services/monitor.service';

@BasicController('monitor')
export class MonitorController {
  constructor(private monitorService: MonitorService, private schedulerService: SchedulerService) {}

  // @IsOwner(Directory)
  @UserRolePermission(Role.Admin, Role.User)
  @StandardApi()
  @Post('add')
  async create(@GetUser() user: User, @Body() body: CreateMonitorBodyDto) {
    const monitor = await this.monitorService.createMonitor(user, body);

    if (monitor.status === MonitorStatus.Waiting) {
      this.schedulerService.ProcessMonitors([monitor]);
    }

    return monitor;
  }
}
