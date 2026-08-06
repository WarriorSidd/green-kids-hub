import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { IsString } from 'class-validator';
import { permissions } from '../rbac/permissions';
import { RequirePermissions } from '../rbac/permissions.decorator';
import { RbacGuard } from '../rbac/rbac.guard';
import { HomeworkService } from './homework.service';

class SubmitHomeworkDto {
  @IsString()
  studentId: string;
}

@UseGuards(AuthGuard('jwt'), RbacGuard)
@Controller('homework')
export class HomeworkController {
  constructor(private readonly homework: HomeworkService) {}

  @Get('class/:classRoomId')
  @RequirePermissions(permissions.VIEW_HOMEWORK)
  listForClass(@Param('classRoomId') classRoomId: string) {
    return this.homework.listForClass(classRoomId);
  }

  @Post(':id/submit')
  @RequirePermissions(permissions.SUBMIT_HOMEWORK)
  submit(@Param('id') id: string, @Body() dto: SubmitHomeworkDto) {
    return this.homework.submit(id, dto.studentId);
  }
}
