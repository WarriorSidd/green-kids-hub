import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { AuthModule } from './auth/auth.module';
import { CommonModule } from './common/common.module';
import { GamesModule } from './games/games.module';
import { HomeworkModule } from './homework/homework.module';
import { ReportsModule } from './reports/reports.module';
import { UsersModule } from './users/users.module';
import { HealthController } from './health.controller';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    CommonModule,
    ThrottlerModule.forRoot([{ ttl: 60_000, limit: 100 }]),
    AuthModule,
    UsersModule,
    GamesModule,
    HomeworkModule,
    ReportsModule
  ],
  controllers: [HealthController]
})
export class AppModule {}
