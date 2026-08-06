import { Controller, Get, Param, UseGuards, Header } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { permissions } from '../rbac/permissions';
import { RequirePermissions } from '../rbac/permissions.decorator';
import { RbacGuard } from '../rbac/rbac.guard';
import { ReportsService } from './reports.service';

@UseGuards(AuthGuard('jwt'), RbacGuard)
@Controller('reports')
export class ReportsController {
  constructor(private readonly reports: ReportsService) {}

  @Get('overview')
  @RequirePermissions(permissions.VIEW_REPORTS)
  overview() {
    return this.reports.platformOverview();
  }

  @Get('class/:classRoomId/progress')
  @RequirePermissions(permissions.VIEW_REPORTS)
  classProgress(@Param('classRoomId') classRoomId: string) {
    return this.reports.classProgress(classRoomId);
  }

  @Get('class/:classRoomId/export')
  @RequirePermissions(permissions.EXPORT_REPORTS)
  @Header('Content-Type', 'text/csv')
  @Header('Content-Disposition', 'attachment; filename="class-progress-report.csv"')
  exportClassReport(@Param('classRoomId') classRoomId: string) {
    return this.reports.exportCSV(classRoomId);
  }
}
