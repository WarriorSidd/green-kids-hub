import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { demoPassword, demoUsers, isDemoMode } from '../common/demo-data';
import { PrismaService } from '../common/prisma.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
    private readonly config: ConfigService
  ) {}

  async login(email: string, password: string) {
    if (isDemoMode()) {
      const user = demoUsers.find((item) => item.email === email);
      if (!user || password !== demoPassword) {
        throw new UnauthorizedException('Invalid credentials');
      }
      return {
        user: {
          id: user.id,
          email: user.email,
          displayName: user.displayName,
          role: user.role,
          studentId: user.studentId,
          teacherId: user.teacherId
        },
        ...(await this.issueTokens(user.id, user.email, user.roleId))
      };
    }

    const user = await this.prisma.user.findUnique({
      where: { email },
      include: { role: true, studentProfile: true, teacherProfile: true }
    });

    if (!user || !user.isActive || !(await bcrypt.compare(password, user.passwordHash))) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const tokens = await this.issueTokens(user.id, user.email, user.roleId);
    await this.prisma.auditLog.create({
      data: { userId: user.id, action: 'auth.login', entity: 'User', entityId: user.id }
    });

    return {
      user: {
        id: user.id,
        email: user.email,
        displayName: user.displayName,
        role: user.role.key,
        studentId: user.studentProfile?.id,
        teacherId: user.teacherProfile?.id
      },
      ...tokens
    };
  }

  async refresh(refreshToken: string) {
    const payload = await this.jwt.verifyAsync<{ sub: string; email: string; roleId: string }>(refreshToken, {
      secret: this.config.getOrThrow<string>('JWT_REFRESH_SECRET')
    });
    if (isDemoMode()) {
      return this.issueTokens(payload.sub, payload.email, payload.roleId);
    }

    const storedTokens = await this.prisma.refreshToken.findMany({
      where: { userId: payload.sub, revokedAt: null, expiresAt: { gt: new Date() } }
    });
    const isKnownToken = await Promise.any(
      storedTokens.map((token) => bcrypt.compare(refreshToken, token.tokenHash))
    ).catch(() => false);

    if (!isKnownToken) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    return this.issueTokens(payload.sub, payload.email, payload.roleId);
  }

  private async issueTokens(userId: string, email: string, roleId: string) {
    const payload = { sub: userId, email, roleId };
    const accessToken = await this.jwt.signAsync(payload, {
      secret: this.config.getOrThrow<string>('JWT_ACCESS_SECRET'),
      expiresIn: this.config.get<string>('JWT_ACCESS_TTL') ?? '15m'
    });
    const refreshToken = await this.jwt.signAsync(payload, {
      secret: this.config.getOrThrow<string>('JWT_REFRESH_SECRET'),
      expiresIn: this.config.get<string>('JWT_REFRESH_TTL') ?? '7d'
    });
    if (isDemoMode()) {
      return { accessToken, refreshToken };
    }

    await this.prisma.refreshToken.create({
      data: {
        userId,
        tokenHash: await bcrypt.hash(refreshToken, 12),
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
      }
    });
    return { accessToken, refreshToken };
  }
}
