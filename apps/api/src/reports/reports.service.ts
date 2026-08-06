import { Injectable } from '@nestjs/common';
import { demoGames, demoHomework, demoStudents, demoTeachers, isDemoMode } from '../common/demo-data';
import { PrismaService } from '../common/prisma.service';

@Injectable()
export class ReportsService {
  constructor(private readonly prisma: PrismaService) {}

  async platformOverview() {
    if (isDemoMode()) {
      return {
        students: demoStudents.length,
        teachers: demoTeachers.length,
        games: demoGames.length,
        scores: 3,
        homework: demoHomework.length
      };
    }

    const [students, teachers, games, scores, homework] = await Promise.all([
      this.prisma.student.count(),
      this.prisma.teacher.count(),
      this.prisma.game.count(),
      this.prisma.score.count(),
      this.prisma.homework.count()
    ]);
    return { students, teachers, games, scores, homework };
  }

  async classProgress(classRoomId: string) {
    if (isDemoMode()) {
      return demoStudents
        .filter((student) => student.classRoom.id === classRoomId)
        .map((student) => ({
          studentId: student.id,
          name: student.user.displayName,
          gamesPlayed: 3,
          averageScore: 86,
          homeworkCompleted: 0,
          achievements: 2
        }));
    }

    const students = await this.prisma.student.findMany({
      where: { classRoomId },
      include: { user: true, scores: true, homeworkItems: true, achievements: true }
    });

    return students.map((student) => ({
      studentId: student.id,
      name: student.user.displayName,
      gamesPlayed: student.scores.length,
      averageScore: student.scores.length
        ? Math.round(student.scores.reduce((sum, score) => sum + score.points, 0) / student.scores.length)
        : 0,
      homeworkCompleted: student.homeworkItems.filter((item) => item.status === 'COMPLETED').length,
      achievements: student.achievements.length
    }));
  }

  async exportCSV(classRoomId: string) {
    const data = await this.classProgress(classRoomId);
    const rows = [
      ['Student ID', 'Student Name', 'Games Played', 'Average Score %', 'Homework Completed', 'Achievements Earned'],
      ...data.map((item) => [
        item.studentId,
        item.name,
        item.gamesPlayed,
        `${item.averageScore}%`,
        item.homeworkCompleted,
        item.achievements
      ])
    ];
    return rows.map((r) => r.join(',')).join('\n');
  }
}
