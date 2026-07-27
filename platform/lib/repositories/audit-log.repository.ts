import "server-only";

import { type Prisma } from "@prisma/client";

import { handlePrisma } from "@/lib/db/errors";
import { buildPaginatedResult, toSkipTake } from "@/lib/db/pagination";
import type { PaginationInput } from "@/lib/db/types";
import { BaseRepository } from "@/lib/repositories/base.repository";

export type CreateAuditLogInput = {
  actorId?: string;
  action: string;
  resource: string;
  recordId?: string;
  ipAddress?: string;
  userAgent?: string;
  previousValues?: Prisma.InputJsonValue;
  newValues?: Prisma.InputJsonValue;
  outcome?: string;
  requestId?: string;
};

export class AuditLogRepository extends BaseRepository {
  async create(input: CreateAuditLogInput) {
    return handlePrisma(() =>
      this.db.auditLog.create({
        data: {
          actorId: input.actorId,
          action: input.action,
          resource: input.resource,
          recordId: input.recordId,
          ipAddress: input.ipAddress,
          userAgent: input.userAgent,
          previousValues: input.previousValues,
          newValues: input.newValues,
          outcome: input.outcome ?? "SUCCESS",
          requestId: input.requestId,
        },
      }),
    );
  }

  async findById(id: string) {
    return handlePrisma(() =>
      this.db.auditLog.findUnique({
        where: { id },
      }),
    );
  }

  async listByActor(actorId: string, pagination: PaginationInput) {
    const where = { actorId };
    const { skip, take } = toSkipTake(pagination);

    const [items, total] = await handlePrisma(() =>
      Promise.all([
        this.db.auditLog.findMany({
          where,
          skip,
          take,
          orderBy: { createdAt: "desc" },
        }),
        this.db.auditLog.count({ where }),
      ]),
    );

    return buildPaginatedResult(items, total, pagination);
  }

  async listByResource(
    resource: string,
    recordId: string,
    pagination: PaginationInput,
  ) {
    const where = { resource, recordId };
    const { skip, take } = toSkipTake(pagination);

    const [items, total] = await handlePrisma(() =>
      Promise.all([
        this.db.auditLog.findMany({
          where,
          skip,
          take,
          orderBy: { createdAt: "desc" },
        }),
        this.db.auditLog.count({ where }),
      ]),
    );

    return buildPaginatedResult(items, total, pagination);
  }
}

export const auditLogRepository = new AuditLogRepository();
