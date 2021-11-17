import { JwtService } from '@nestjs/jwt';
import { LessThan, MoreThan } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';

import { InjectableService } from '../../../common/decorators/common.decorator';
import { User } from '../../account/entities/user.entity';
import { Session } from '../entities/session.entity';
import { SessionRepository } from '../repositories/session.repository';

@InjectableService()
export class AuthService {
  constructor(private jwtService: JwtService, private sessionRepository: SessionRepository) {}

  async buildJWTToken(user: User): Promise<string> {
    const token = this.jwtService.sign({ id: user.id });
    return token;
  }

  async isUserRefreshTokenValid(user: User, refreshToken: string): Promise<boolean> {
    const session = await this.sessionRepository.findOne({ user, refreshToken, expiresAt: MoreThan(new Date()) });
    return !!session;
  }

  async addNewSession(user: User): Promise<Session> {
    const uuid = uuidv4();

    const newSession = await this.sessionRepository.createAndSave({
      user,
      refreshToken: uuid,
    });

    return newSession;
  }

  async deleteSession(session: Session): Promise<void> {
    await this.sessionRepository.softDelete(session.id);
  }
}
