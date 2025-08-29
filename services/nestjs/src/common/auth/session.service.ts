import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../database/prisma.service';
import { AuthenticatedUser } from './permissions.guard';
import { Role } from './permissions';

/**
 * Session context interface
 */
export interface SessionContext {
  sessionId: string;
  userId: string;
  tenantId: string;
  departmentId?: string | null;
  role: Role;
  permissions: string[];
  createdAt: Date;
  expiresAt: Date;
  lastActivityAt: Date;
  isActive: boolean;
}

/**
 * Session activity tracking
 */
export interface SessionActivity {
  sessionId: string;
  activityType: 'LOGIN' | 'API_CALL' | 'PERMISSION_CHECK' | 'LOGOUT';
  endpoint?: string;
  ipAddress?: string;
  userAgent?: string;
  metadata?: Record<string, any>;
  timestamp: Date;
}

/**
 * Session Service
 * 
 * Manages user sessions with RBAC context:
 * - Session creation and validation
 * - Activity tracking for audit purposes
 * - Role and permission context caching
 * - Session invalidation on role/permission changes
 */
@Injectable()
export class SessionService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
  ) {}

  /**
   * Create a new user session
   */
  async createSession(
    user: AuthenticatedUser,
    sessionToken: string,
    metadata?: Record<string, any>
  ): Promise<SessionContext> {
    const expiresAt = new Date();
    const sessionDuration = this.getSessionDuration();
    expiresAt.setTime(expiresAt.getTime() + sessionDuration * 1000);

    // Get user permissions
    const { getRolePermissions } = await import('./permissions');
    const permissions = getRolePermissions(user.role).map(p => p.toString());

    // Create session record
    const session = await this.prisma.userSession.create({
      data: {
        userId: user.id,
        sessionToken,
        expiresAt,
        isActive: true,
        metadata: {
          tenantId: user.tenantId,
          departmentId: user.departmentId,
          role: user.role,
          permissions,
          loginMetadata: metadata,
        },
      },
    });

    // Log session creation activity
    await this.logSessionActivity({
      sessionId: session.id,
      activityType: 'LOGIN',
      metadata: {
        tenantId: user.tenantId,
        departmentId: user.departmentId,
        role: user.role,
        ...metadata,
      },
      timestamp: new Date(),
    });

    return {
      sessionId: session.id,
      userId: user.id,
      tenantId: user.tenantId,
      departmentId: user.departmentId,
      role: user.role,
      permissions,
      createdAt: session.createdAt,
      expiresAt: session.expiresAt,
      lastActivityAt: session.lastActivityAt || session.createdAt,
      isActive: session.isActive,
    };
  }

  /**
   * Validate and refresh session
   */
  async validateSession(sessionToken: string): Promise<SessionContext | null> {
    const session = await this.prisma.userSession.findFirst({
      where: {
        sessionToken,
        isActive: true,
        expiresAt: {
          gt: new Date(),
        },
      },
      include: {
        user: {
          include: {
            department: {
              select: {
                name: true,
              },
            },
          },
        },
      },
    });

    if (!session || !session.user) {
      return null;
    }

    // Check if user is still active
    if (!session.user.isActive) {
      await this.invalidateSession(sessionToken);
      return null;
    }

    // Update last activity
    await this.updateSessionActivity(session.id);

    // Get current permissions (in case role changed)
    const { getRolePermissions } = await import('./permissions');
    const currentPermissions = getRolePermissions(session.user.role as Role).map(p => p.toString());

    return {
      sessionId: session.id,
      userId: session.user.id,
      tenantId: session.user.tenantId,
      departmentId: session.user.departmentId,
      role: session.user.role as Role,
      permissions: currentPermissions,
      createdAt: session.createdAt,
      expiresAt: session.expiresAt,
      lastActivityAt: session.lastActivityAt || session.createdAt,
      isActive: session.isActive,
    };
  }

  /**
   * Invalidate a specific session
   */
  async invalidateSession(sessionToken: string): Promise<void> {
    const session = await this.prisma.userSession.findFirst({
      where: { sessionToken, isActive: true },
    });

    if (session) {
      await this.prisma.userSession.update({
        where: { id: session.id },
        data: {
          isActive: false,
          revokedAt: new Date(),
        },
      });

      // Log logout activity
      await this.logSessionActivity({
        sessionId: session.id,
        activityType: 'LOGOUT',
        timestamp: new Date(),
      });
    }
  }

  /**
   * Invalidate all sessions for a user
   */
  async invalidateAllUserSessions(userId: string, except?: string): Promise<void> {
    const whereClause: any = {
      userId,
      isActive: true,
    };

    if (except) {
      whereClause.sessionToken = { not: except };
    }

    const sessions = await this.prisma.userSession.findMany({
      where: whereClause,
      select: { id: true },
    });

    if (sessions.length > 0) {
      await this.prisma.userSession.updateMany({
        where: whereClause,
        data: {
          isActive: false,
          revokedAt: new Date(),
        },
      });

      // Log logout activities
      for (const session of sessions) {
        await this.logSessionActivity({
          sessionId: session.id,
          activityType: 'LOGOUT',
          metadata: { reason: 'all_sessions_invalidated' },
          timestamp: new Date(),
        });
      }
    }
  }

  /**
   * Invalidate sessions by role change
   */
  async invalidateSessionsByRoleChange(userId: string): Promise<void> {
    await this.invalidateAllUserSessions(userId);
  }

  /**
   * Update session activity timestamp
   */
  async updateSessionActivity(sessionId: string): Promise<void> {
    await this.prisma.userSession.update({
      where: { id: sessionId },
      data: { lastActivityAt: new Date() },
    });
  }

  /**
   * Log session activity for audit purposes
   */
  async logSessionActivity(activity: SessionActivity): Promise<void> {
    await this.prisma.sessionActivity.create({
      data: {
        sessionId: activity.sessionId,
        activityType: activity.activityType,
        endpoint: activity.endpoint,
        ipAddress: activity.ipAddress,
        userAgent: activity.userAgent,
        metadata: activity.metadata,
        createdAt: activity.timestamp,
      },
    });
  }

  /**
   * Track API call activity
   */
  async trackAPIActivity(
    sessionId: string,
    endpoint: string,
    ipAddress?: string,
    userAgent?: string,
    metadata?: Record<string, any>
  ): Promise<void> {
    await this.logSessionActivity({
      sessionId,
      activityType: 'API_CALL',
      endpoint,
      ipAddress,
      userAgent,
      metadata,
      timestamp: new Date(),
    });
  }

  /**
   * Track permission check activity
   */
  async trackPermissionCheck(
    sessionId: string,
    permission: string,
    granted: boolean,
    resource?: string,
    metadata?: Record<string, any>
  ): Promise<void> {
    await this.logSessionActivity({
      sessionId,
      activityType: 'PERMISSION_CHECK',
      metadata: {
        permission,
        granted,
        resource,
        ...metadata,
      },
      timestamp: new Date(),
    });
  }

  /**
   * Get active sessions for a user
   */
  async getActiveSessions(userId: string): Promise<SessionContext[]> {
    const sessions = await this.prisma.userSession.findMany({
      where: {
        userId,
        isActive: true,
        expiresAt: { gt: new Date() },
      },
      include: {
        user: {
          select: {
            role: true,
            tenantId: true,
            departmentId: true,
          },
        },
      },
      orderBy: { lastActivityAt: 'desc' },
    });

    const { getRolePermissions } = await import('./permissions');

    return sessions.map(session => ({
      sessionId: session.id,
      userId: session.userId,
      tenantId: session.user.tenantId,
      departmentId: session.user.departmentId,
      role: session.user.role as Role,
      permissions: getRolePermissions(session.user.role as Role).map(p => p.toString()),
      createdAt: session.createdAt,
      expiresAt: session.expiresAt,
      lastActivityAt: session.lastActivityAt || session.createdAt,
      isActive: session.isActive,
    }));
  }

  /**
   * Clean up expired sessions
   */
  async cleanupExpiredSessions(): Promise<number> {
    const result = await this.prisma.userSession.updateMany({
      where: {
        OR: [
          { expiresAt: { lt: new Date() } },
          { 
            isActive: true,
            lastActivityAt: {
              lt: new Date(Date.now() - this.getSessionInactivityTimeout() * 1000)
            }
          }
        ],
      },
      data: {
        isActive: false,
        revokedAt: new Date(),
      },
    });

    return result.count;
  }

  /**
   * Get session statistics for monitoring
   */
  async getSessionStats(): Promise<{
    total: number;
    active: number;
    byRole: Record<string, number>;
    byTenant: Record<string, number>;
  }> {
    const [totalSessions, activeSessions, sessionsByRole, sessionsByTenant] = await Promise.all([
      this.prisma.userSession.count(),
      this.prisma.userSession.count({
        where: {
          isActive: true,
          expiresAt: { gt: new Date() },
        },
      }),
      this.prisma.$queryRaw`
        SELECT u.role, COUNT(*) as count
        FROM user_sessions us
        JOIN users u ON us.user_id = u.id
        WHERE us.is_active = true AND us.expires_at > NOW()
        GROUP BY u.role
      `,
      this.prisma.$queryRaw`
        SELECT u.tenant_id, COUNT(*) as count
        FROM user_sessions us
        JOIN users u ON us.user_id = u.id
        WHERE us.is_active = true AND us.expires_at > NOW()
        GROUP BY u.tenant_id
      `,
    ]);

    return {
      total: totalSessions,
      active: activeSessions,
      byRole: (sessionsByRole as any[]).reduce((acc, row) => {
        acc[row.role] = parseInt(row.count);
        return acc;
      }, {}),
      byTenant: (sessionsByTenant as any[]).reduce((acc, row) => {
        acc[row.tenant_id] = parseInt(row.count);
        return acc;
      }, {}),
    };
  }

  /**
   * Get session duration in seconds
   */
  private getSessionDuration(): number {
    const duration = this.configService.get<string>('SESSION_DURATION') || '24h';
    
    if (duration.endsWith('h')) {
      return parseInt(duration) * 3600;
    } else if (duration.endsWith('m')) {
      return parseInt(duration) * 60;
    } else if (duration.endsWith('d')) {
      return parseInt(duration) * 86400;
    }
    
    return parseInt(duration); // Assume seconds if no unit
  }

  /**
   * Get session inactivity timeout in seconds
   */
  private getSessionInactivityTimeout(): number {
    const timeout = this.configService.get<string>('SESSION_INACTIVITY_TIMEOUT') || '30m';
    
    if (timeout.endsWith('h')) {
      return parseInt(timeout) * 3600;
    } else if (timeout.endsWith('m')) {
      return parseInt(timeout) * 60;
    } else if (timeout.endsWith('d')) {
      return parseInt(timeout) * 86400;
    }
    
    return parseInt(timeout); // Assume seconds if no unit
  }
}