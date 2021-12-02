import { BadRequestException, Body, Get, Ip, Post, Req } from '@nestjs/common';
import { Request } from 'express';
import * as UserAgentParser from 'ua-parser-js';

import { BasicController } from '../../../common/basic/Basic.controller';
import { GetUser } from '../../../common/decorators/get-user.decorator';
import { UserRolePermission } from '../../../common/decorators/role-permission.decorator';
import { StandardApi } from '../../../common/decorators/standard-api.decorator';
import { AsyncStdRes } from '../../../common/types/standard-res.type';
import { Role } from '../../auth/enum/role.enum';
import { AuthService } from '../../auth/services/auth.service';
import { LoginBodyDto, LoginResDto } from '../dto/user/login.register';
import { RefreshBodyDto, RefreshResDto } from '../dto/user/refresh.dto';
import { RegisterBodyDto, RegisterResDto } from '../dto/user/register.dto';
import { WhoAmIResDto } from '../dto/user/who-am-i.dto';
import { User } from '../entities/user.entity';
import { TeamService } from '../services/team.service';
import { UserService } from '../services/user.service';

@BasicController('user')
export class UserController {
  constructor(private userService: UserService, private teamService: TeamService, private authService: AuthService) {}

  @UserRolePermission(Role.User, Role.Admin, Role.Owner)
  @StandardApi({ type: WhoAmIResDto })
  @Get('who-am-i')
  async whoAmI(@GetUser() user: User): AsyncStdRes<WhoAmIResDto> {
    const userInfo = await this.userService.whoAmI(user);
    return userInfo;
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

    const session = await this.authService.addNewSession(user);

    user.sessions = [session];

    const jwt = await this.authService.buildJWTToken(user);

    return { ...user, jwt };
  }

  @StandardApi({ type: LoginResDto })
  @Post('login')
  async login(@Body() body: LoginBodyDto): AsyncStdRes<LoginResDto> {
    const { email, password } = body;
    const user = await this.userService.checkUserCredential(email, password);

    const jwt = await this.authService.buildJWTToken(user);

    const session = await this.authService.addNewSession(user);

    user.sessions = [session];

    return { ...user, jwt };
  }

  @StandardApi({ type: RefreshResDto })
  @Post('refresh')
  async refresh(@Ip() ip: string, @Req() req: Request, @Body() body: RefreshBodyDto): AsyncStdRes<RefreshResDto> {
    const { refreshToken } = body;

    const ua = UserAgentParser(req.headers['user-agent']);

    const user = await this.authService.isUserRefreshTokenValid(refreshToken);

    if (!user) {
      throw new BadRequestException('Invalid refresh token');
    }

    const jwt = await this.authService.buildJWTToken(user);

    return { ...user, jwt };
  }
}
