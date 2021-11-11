import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './app/auth/auth.module';
import { UserModule } from './app/user/user.module';
import { typeOrmCOnfig } from './config/typeorm.config';
import { CommonModule } from './common/common.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) =>
        typeOrmCOnfig(configService),
    }),
    AuthModule,
    UserModule,
    CommonModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
