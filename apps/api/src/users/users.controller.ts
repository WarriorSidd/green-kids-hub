import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { permissions } from '../rbac/permissions';
import { RequirePermissions } from '../rbac/permissions.decorator';
import { RbacGuard } from '../rbac/rbac.guard';
import { UsersService } from './users.service';

@UseGuards(AuthGuard('jwt'), RbacGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly users: UsersService) {}

  @Get('students')
  @RequirePermissions(permissions.VIEW_ALL_STUDENTS)
  students(@Query('classRoomId') classRoomId?: string) {
    return this.users.listStudents(classRoomId);
  }

  @Get('teachers')
  @RequirePermissions(permissions.MANAGE_TEACHERS)
  teachers() {
    return this.users.listTeachers();
  }
}
