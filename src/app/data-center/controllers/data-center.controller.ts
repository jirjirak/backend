import { Body, Post } from '@nestjs/common';
import { User } from 'src/app/account/entities/user.entity';
import { BasicController } from 'src/common/basic/Basic.controller';
import { AllowedToAccess } from 'src/common/decorators/allowed-to-access.decorator';
import { GetUser } from 'src/common/decorators/get-user.decorator';
import { UserRolePermission } from 'src/common/decorators/role-permission.decorator';
import { StandardApi } from 'src/common/decorators/standard-api.decorator';
import { RegisterDataCenterBodyDto, RegisterDataCenterResDto } from '../dto/data-center/register.dto';
import { DataCenterService } from '../services/data-center.service';

@BasicController('data-center')
export class DataCenterController {
  constructor(private dataCenterService: DataCenterService) {}

  @AllowedToAccess('update', 'team')
  @UserRolePermission()
  @StandardApi({ type: RegisterDataCenterResDto })
  @Post('add')
  async add(@GetUser() user: User, @Body() body: RegisterDataCenterBodyDto): Promise<RegisterDataCenterResDto> {
    const dataCenter = await this.dataCenterService.add(user, body);
    return dataCenter;
  }
}
