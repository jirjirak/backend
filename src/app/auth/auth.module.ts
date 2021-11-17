import { forwardRef, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AccountModule } from '../account/account.module';
import { JwtStrategy } from './jwt.strategy';
import { SessionRepository } from './repositories/session.repository';
import { AuthService } from './services/auth.service';

@Module({
  imports: [
    JwtModule.register({
      privateKey: '1',
      signOptions: { expiresIn: '10m' },
    }),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    forwardRef(() => AccountModule),
    TypeOrmModule.forFeature([SessionRepository]),
  ],
  providers: [JwtStrategy, AuthService],
  exports: [JwtStrategy, AuthService],
})
export class AuthModule {}
