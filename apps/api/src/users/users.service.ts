import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { RoleKey, ClassLevel } from '@prisma/client';
import * as bcrypt from 'bcryptjs';
import { demoStudents, demoTeachers, isDemoMode } from '../common/demo-data';
import { PrismaService } from '../common/prisma.service';

export interface CreateUserDto {
  email: string;
  displayName: string;
  role: RoleKey;
  classLevel?: ClassLevel;
  password: string;
}

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  listStudents(classRoomId?: string) {
    if (isDemoMode()) {
      return demoStudents.filter((student) => !classRoomId || student.classRoom.id === classRoomId);
    }

    return this.prisma.student.findMany({
      where: classRoomId ? { classRoomId } : undefined,
      include: { user: { select: { id: true, displayName: true, email: true } }, classRoom: true },
      orderBy: { createdAt: 'desc' }
    });
  }

  listTeachers() {
    if (isDemoMode()) {
      return demoTeachers;
    }

    return this.prisma.teacher.findMany({
      include: {
        user: { select: { id: true, displayName: true, email: true } },
        classes: { include: { classRoom: true } }
      }
    });
  }

  async listAllUsers() {
    if (isDemoMode()) {
      return [];
    }

    return this.prisma.user.findMany({
      include: {
        role: true,
        studentProfile: { include: { classRoom: true } },
        teacherProfile: { include: { classes: { include: { classRoom: true } } } }
      },
      orderBy: { createdAt: 'desc' }
    });
  }

  async createUser(creatorId: string, dto: CreateUserDto) {
    const existing = await this.prisma.user.findUnique({ where: { email: dto.email } });
    if (existing) {
      throw new BadRequestException('User with this email already exists');
    }

    const role = await this.prisma.role.findUnique({ where: { key: dto.role } });
    if (!role) {
      throw new BadRequestException(`Role ${dto.role} not found`);
    }

    const passwordHash = await bcrypt.hash(dto.password, 12);

    let classRoomId: string | undefined;
    if (dto.classLevel) {
      const classRoom = await this.prisma.classRoom.findUnique({ where: { level: dto.classLevel } });
      if (classRoom) classRoomId = classRoom.id;
    }

    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        displayName: dto.displayName,
        passwordHash,
        roleId: role.id,
        isActive: true,
        ...(dto.role === 'STUDENT'
          ? { studentProfile: { create: { classRoomId } } }
          : dto.role === 'TEACHER'
          ? { teacherProfile: { create: {} } }
          : {})
      },
      include: { role: true, studentProfile: true, teacherProfile: true }
    });

    await this.prisma.auditLog.create({
      data: {
        userId: creatorId,
        action: 'user.create',
        entity: 'User',
        entityId: user.id,
        metadata: { createdEmail: user.email, role: dto.role }
      }
    });

    return user;
  }

  async toggleStatus(adminId: string, userId: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');

    const updated = await this.prisma.user.update({
      where: { id: userId },
      data: { isActive: !user.isActive }
    });

    await this.prisma.auditLog.create({
      data: {
        userId: adminId,
        action: updated.isActive ? 'user.activate' : 'user.deactivate',
        entity: 'User',
        entityId: userId
      }
    });

    return updated;
  }
}
