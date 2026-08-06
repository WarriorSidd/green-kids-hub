import { Body, Controller, Get, Param, Patch, Post, Query, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RoleKey } from '@prisma/client';
import { permissions } from '../rbac/permissions';
import { RequirePermissions } from '../rbac/permissions.decorator';
import { RbacGuard } from '../rbac/rbac.guard';
import { UsersService, CreateUserDto } from './users.service';

@UseGuards(AuthGuard('jwt'), RbacGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly users: UsersService) {}

  @Get()
  @RequirePermissions(permissions.MANAGE_USERS)
  allUsers() {
    return this.users.listAllUsers();
  }

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

  @Post()
  @RequirePermissions(permissions.MANAGE_USERS)
  create(@Req() request: { user: { id: string } }, @Body() dto: CreateUserDto) {
    return this.users.createUser(request.user.id, dto);
  }

  @Patch(':id/toggle-status')
  @RequirePermissions(permissions.MANAGE_USERS)
  toggleStatus(@Req() request: { user: { id: string } }, @Param('id') id: string) {
    return this.users.toggleStatus(request.user.id, id);
  }
}
