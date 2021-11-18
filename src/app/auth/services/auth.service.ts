import { BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { LessThan, MoreThan } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';

import { InjectableService } from '../../../common/decorators/common.decorator';
import { User } from '../../account/entities/user.entity';
import { UserService } from '../../account/services/user.service';
import { Session } from '../entities/session.entity';
import { SessionRepository } from '../repositories/session.repository';

@InjectableService()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private sessionRepository: SessionRepository,
    private userService: UserService,
  ) {}

  async buildJWTToken(user: User): Promise<string> {
    const token = this.jwtService.sign({ id: user.id });
    return token;
  }

  async isUserRefreshTokenValid(refreshToken: string): Promise<User> {
    const session = await this.sessionRepository.findOne({
      where: { refreshToken: this.userService.createPassword(refreshToken), expiresAt: MoreThan(new Date()) },
      relations: ['user'],
    });

    return session?.user;
  }

  async addNewSession(user: User): Promise<Session> {
    const uuid = uuidv4();

    const tenMin = 1000 * 60 * 60 * 24 * 7 * 4 * 3;

    const newSession = await this.sessionRepository.createAndSave({
      user,
      refreshToken: this.userService.createPassword(uuid),
      expiresAt: new Date(Date.now() + tenMin),
    });

    return { ...newSession, refreshToken: uuid };
  }

  async deleteSession(session: Session): Promise<void> {
    await this.sessionRepository.softDelete(session.id);
  }

  async findUserByRefreshToken(refreshToken: string): Promise<User> {
    const token = await this.sessionRepository.findOne({
      refreshToken: this.userService.createPassword(refreshToken),
      expiresAt: MoreThan(new Date()),
      relations: ['user'],
    });

    if (!token) {
      throw new BadRequestException('Invalid refresh token');
    }

    return token.user;
  }
}
