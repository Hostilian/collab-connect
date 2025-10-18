import { prisma } from './prisma';
import { logger } from './logger';

export enum AuditAction {
  // Authentication
  USER_LOGIN = 'USER_LOGIN',
  USER_LOGOUT = 'USER_LOGOUT',
  USER_REGISTER = 'USER_REGISTER',
  LOGIN_FAILED = 'LOGIN_FAILED',
  PASSWORD_RESET = 'PASSWORD_RESET',
  EMAIL_VERIFIED = 'EMAIL_VERIFIED',

  // Profile
  PROFILE_CREATED = 'PROFILE_CREATED',
  PROFILE_UPDATED = 'PROFILE_UPDATED',
  PROFILE_DELETED = 'PROFILE_DELETED',
  PROFILE_IMAGE_UPLOADED = 'PROFILE_IMAGE_UPLOADED',

  // Permissions & Roles
  ROLE_ASSIGNED = 'ROLE_ASSIGNED',
  ROLE_REVOKED = 'ROLE_REVOKED',
  PERMISSION_GRANTED = 'PERMISSION_GRANTED',
  PERMISSION_REVOKED = 'PERMISSION_REVOKED',

  // Security
  SUSPICIOUS_ACTIVITY = 'SUSPICIOUS_ACTIVITY',
  RATE_LIMIT_EXCEEDED = 'RATE_LIMIT_EXCEEDED',
  UNAUTHORIZED_ACCESS = 'UNAUTHORIZED_ACCESS',

  // Data
  DATA_EXPORTED = 'DATA_EXPORTED',
  DATA_DELETED = 'DATA_DELETED',

  // API
  API_KEY_CREATED = 'API_KEY_CREATED',
  API_KEY_REVOKED = 'API_KEY_REVOKED',
}

export interface AuditLogEntry {
  action: AuditAction;
  userId?: string;
  userEmail?: string;
  ipAddress?: string;
  userAgent?: string;
  resource?: string;
  resourceId?: string;
  details?: Record<string, unknown>;
  success: boolean;
  errorMessage?: string;
}

/**
 * Log an audit event
 */
export async function logAudit(entry: AuditLogEntry): Promise<void> {
  try {
    const auditClient = (prisma as unknown as { [k: string]: unknown })['auditLog'] as
      | {
          create: (args: unknown) => Promise<unknown>;
        }
      | undefined;

    if (auditClient && process.env.AUDIT_PERSIST !== 'false') {
      await auditClient.create({
        data: {
          action: entry.action,
          userId: entry.userId,
          userEmail: entry.userEmail,
          ipAddress: entry.ipAddress,
          userAgent: entry.userAgent,
          resource: entry.resource,
          resourceId: entry.resourceId,
          details: entry.details as object,
          success: entry.success,
          errorMessage: entry.errorMessage,
          timestamp: new Date(),
        },
      });
    }

    // Also log to console in development
    if (process.env.NODE_ENV === 'development') {
      logger.info('[AUDIT]', {
        action: entry.action,
        user: entry.userEmail || entry.userId,
        success: entry.success,
        timestamp: new Date().toISOString(),
      });
    }
  } catch (error) {
    // Don't throw - audit logging should not break the main flow
    logger.error('Audit logging failed', { error: String(error) });
  }
}

/**
 * Get client information from request
 */
export function getClientInfo(request: Request): {
  ipAddress: string;
  userAgent: string;
} {
  const forwarded = request.headers.get('x-forwarded-for');
  const realIp = request.headers.get('x-real-ip');
  const cfIp = request.headers.get('cf-connecting-ip');

  const ipAddress = cfIp || realIp || forwarded?.split(',')[0] || 'unknown';
  const userAgent = request.headers.get('user-agent') || 'unknown';

  return { ipAddress, userAgent };
}

/**
 * Query audit logs
 */
export async function getAuditLogs(filters?: {
  userId?: string;
  action?: AuditAction;
  startDate?: Date;
  endDate?: Date;
  success?: boolean;
  limit?: number;
  offset?: number;
}) {
  const where: Record<string, unknown> = {};

  if (filters?.userId) where.userId = filters.userId;
  if (filters?.action) where.action = filters.action;
  if (filters?.success !== undefined) where.success = filters.success;

  if (filters?.startDate || filters?.endDate) {
    where.timestamp = {} as { gte?: Date; lte?: Date };
    if (filters.startDate) (where.timestamp as { gte?: Date; lte?: Date }).gte = filters.startDate;
    if (filters.endDate) (where.timestamp as { gte?: Date; lte?: Date }).lte = filters.endDate;
  }

  const client = (prisma as unknown as { [k: string]: unknown })['auditLog'] as
    | {
        findMany: (args: unknown) => Promise<unknown[]>;
        count: (args: unknown) => Promise<number>;
      }
    | undefined;

  if (!client) {
    return { logs: [], total: 0 };
  }

  const [logs, total] = await Promise.all([
    client.findMany({
      where,
      orderBy: { timestamp: 'desc' },
      take: filters?.limit || 100,
      skip: filters?.offset || 0,
    }),
    client.count({ where }),
  ]);

  return { logs, total };
}

/**
 * Get audit statistics
 */
export async function getAuditStats(userId?: string) {
  const where = userId ? { userId } : {};

  const client = (prisma as unknown as { [k: string]: unknown })['auditLog'] as
    | {
        count: (args: unknown) => Promise<number>;
        groupBy: (args: unknown) => Promise<Array<{ action: string; _count: number }>>;
        findMany: (args: unknown) => Promise<unknown[]>;
      }
    | undefined;

  if (!client) {
    return { total: 0, byAction: {}, recentFailed: [] };
  }

  const [total, byAction, recentFailed] = await Promise.all([
    client.count({ where }),
    client.groupBy({
      by: ['action'],
      where,
      _count: true,
    }),
    client.findMany({
      where: { ...where, success: false },
      orderBy: { timestamp: 'desc' },
      take: 10,
    }),
  ]);

  return {
    total,
    byAction: byAction.reduce((acc: Record<string, number>, item: { action: string; _count: number }) => {
      acc[item.action] = item._count;
      return acc;
    }, {} as Record<string, number>),
    recentFailed,
  };
}
