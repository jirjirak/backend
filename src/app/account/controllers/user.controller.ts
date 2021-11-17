import { Body, Get, Post } from '@nestjs/common';

import { BasicController } from '../../../common/basic/Basic.controller';
import { IsStringField } from '../../../common/decorators/common.decorator';
import { GetUser } from '../../../common/decorators/get-user.decorator';
import { UserRolePermission } from '../../../common/decorators/role-permission.decorator';
import { StandardApi } from '../../../common/decorators/standard-api.decorator';
import { AsyncStdRes } from '../../../common/types/standard-res.type';
import { Role } from '../../auth/enum/role.enum';
import { AuthService } from '../../auth/services/auth.service';
import { LoginBodyDto, LoginResDto } from '../dto/user/login.register';
import { RegisterBodyDto, RegisterResDto } from '../dto/user/register.dto';
import { User } from '../entities/user.entity';
import { TeamService } from '../services/team.service';
import { UserService } from '../services/user.service';

class reza {
  @IsStringField()
  ali: string;
}

@BasicController('user')
export class UserController {
  constructor(private userService: UserService, private teamService: TeamService, private authService: AuthService) {}

  @UserRolePermission(Role.User)
  @StandardApi({ type: reza })
  @Get('who-am-i')
  async whoAmI(@GetUser() user: User): AsyncStdRes<reza> {
    console.log(user);

    return { ali: 'ok' };
  }

  @StandardApi({ type: RegisterResDto })
  @Post('register')
  async register(@Body() body: RegisterBodyDto): AsyncStdRes<RegisterResDto> {
    let user: User;

    user = await this.userService.createSystemOwner(body);

    if (!user) {
      user = await this.userService.createUser(body);
    }

    const defaultTeam = await this.teamService.createDefaultTeam(user);

    user.teams = [defaultTeam];

    const jwt = await this.authService.buildJWTToken(user);

    return { ...user, jwt };
  }

  @StandardApi({ type: LoginResDto })
  @Post('login')
  async login(@Body() body: LoginBodyDto): AsyncStdRes<LoginResDto> {
    const { email, password } = body;
    const user = await this.userService.checkUserCredential(email, password);
    const jwt = await this.authService.buildJWTToken(user);
    return { ...user, jwt };
  }
}
