import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

import { AccountModule } from '../account/account.module';
import { JwtStrategy } from './jwt.strategy';

@Module({
  imports: [
    JwtModule.register({
      privateKey: '1',
      signOptions: { expiresIn: '1d' },
    }),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    AccountModule,
  ],
  providers: [JwtStrategy],
  exports: [JwtStrategy],
})
export class AuthModule {}
