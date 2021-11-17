import { forwardRef, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthModule } from '../auth/auth.module';
import { UserController } from './controllers/user.controller';
import { TeamRepository } from './repositories/team.repository';
import { UserRepository } from './repositories/user.repository';
import { TeamService } from './services/team.service';
import { UserService } from './services/user.service';

@Module({
  imports: [forwardRef(() => AuthModule), TypeOrmModule.forFeature([UserRepository, TeamRepository])],
  controllers: [UserController],
  providers: [UserService, TeamService],
  exports: [UserService],
})
export class AccountModule {}
