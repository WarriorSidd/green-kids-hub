import { Module } from '@nestjs/common';
import { RbacGuard } from '../rbac/rbac.guard';
import { HomeworkController } from './homework.controller';
import { HomeworkService } from './homework.service';

@Module({
  controllers: [HomeworkController],
  providers: [HomeworkService, RbacGuard]
})
export class HomeworkModule {}
