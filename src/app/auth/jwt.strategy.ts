import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { User } from '../account/entities/user.entity';
import { UserService } from '../account/services/user.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private userService: UserService, private configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get('SECRETE_KEY') || 'i am very secrete',
    });
  }

  async validate(payload: any): Promise<User> {
    const user = await this.userService.authenticateUser(payload.id);

    if (!user) {
      throw new UnauthorizedException();
    }

    return user;
  }
}
