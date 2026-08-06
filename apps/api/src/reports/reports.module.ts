import { Module } from '@nestjs/common';
import { RbacGuard } from '../rbac/rbac.guard';
import { ReportsController } from './reports.controller';
import { ReportsService } from './reports.service';

@Module({
  controllers: [ReportsController],
  providers: [ReportsService, RbacGuard]
})
export class ReportsModule {}
