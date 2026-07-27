import "server-only";

import type { Prisma } from "@prisma/client";

import { logger } from "@/lib/logger";
import { auditLogRepository } from "@/lib/repositories/audit-log.repository";

export type SecurityEventType =
  | "SIGN_IN_SUCCESS"
  | "SIGN_IN_FAILURE"
  | "SIGN_OUT"
  | "REGISTER"
  | "PASSWORD_RESET_REQUEST"
  | "PASSWORD_RESET_SUCCESS"
  | "EMAIL_VERIFY"
  | "EMAIL_VERIFY_FAILURE"
  | "PERMISSION_DENIED"
  | "RATE_LIMITED"
  | "CSRF_FAILURE"
  | "SESSION_REVOKED";

export type SecurityEvent = {
  type: SecurityEventType;
  userId?: string;
  email?: string;
  ip?: string;
  userAgent?: string;
  meta?: Record<string, unknown>;
};

export async function logSecurityEvent(event: SecurityEvent): Promise<void> {
  const payload = {
    eventType: event.type,
    userId: event.userId,
    email: event.email?.toLowerCase(),
    ip: event.ip,
    userAgent: event.userAgent,
    meta: event.meta,
  };

  if (event.type.endsWith("FAILURE") || event.type === "PERMISSION_DENIED") {
    logger.warn(payload, "auth.security_event");
  } else {
    logger.info(payload, "auth.security_event");
  }

  if (!event.userId) {
    return;
  }

  try {
    await auditLogRepository.create({
      actorId: event.userId,
      action: event.type,
      resource: "AUTH",
      recordId: event.userId,
      ipAddress: event.ip,
      userAgent: event.userAgent,
      newValues: event.meta as Prisma.InputJsonValue | undefined,
      outcome: event.type.endsWith("FAILURE") ? "FAILURE" : "SUCCESS",
    });
  } catch (error) {
    logger.error({ err: error, eventType: event.type, userId: event.userId }, "auth.audit_failed");
  }
}
