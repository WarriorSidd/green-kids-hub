import { Injectable } from '@nestjs/common';
import { demoStudents, demoTeachers, isDemoMode } from '../common/demo-data';
import { PrismaService } from '../common/prisma.service';

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
}
