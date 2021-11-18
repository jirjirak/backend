import { forwardRef, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AccountModule } from '../account/account.module';
import { JwtStrategy } from './jwt.strategy';
import { SessionRepository } from './repositories/session.repository';
import { AuthService } from './services/auth.service';

@Module({
  imports: [
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        privateKey: configService.get('SECRETE_KEY'),
        signOptions: { expiresIn: configService.get('JWT_EXPIREIN') },
      }),
    }),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    forwardRef(() => AccountModule),
    TypeOrmModule.forFeature([SessionRepository]),
  ],
  providers: [JwtStrategy, AuthService],
  exports: [JwtStrategy, AuthService],
})
export class AuthModule {}
