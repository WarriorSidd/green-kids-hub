import { Injectable } from '@nestjs/common';
import { HomeworkStatus } from '@prisma/client';
import { demoHomework, isDemoMode } from '../common/demo-data';
import { PrismaService } from '../common/prisma.service';

@Injectable()
export class HomeworkService {
  constructor(private readonly prisma: PrismaService) {}

  listForClass(classRoomId: string) {
    if (isDemoMode()) {
      return demoHomework.filter((item) => item.classRoomId === classRoomId);
    }

    return this.prisma.homework.findMany({
      where: { classRoomId },
      include: { games: { include: { game: true } }, submissions: true },
      orderBy: { dueDate: 'asc' }
    });
  }

  submit(homeworkId: string, studentId: string) {
    if (isDemoMode()) {
      return {
        id: `demo-submission-${studentId}`,
        homeworkId,
        studentId,
        status: HomeworkStatus.SUBMITTED,
        submittedAt: new Date().toISOString()
      };
    }

    return this.prisma.homeworkSubmission.upsert({
      where: { homeworkId_studentId: { homeworkId, studentId } },
      create: { homeworkId, studentId, status: HomeworkStatus.SUBMITTED, submittedAt: new Date() },
      update: { status: HomeworkStatus.SUBMITTED, submittedAt: new Date() }
    });
  }
}
