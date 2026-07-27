import { Prisma } from "@prisma/client";

import {
  AppError,
  ConflictError,
  NotFoundError,
  ValidationError,
} from "@/lib/errors";

export class UniqueConstraintError extends ConflictError {
  readonly fields: string[];

  constructor(fields: string[], message?: string) {
    super(message ?? `Unique constraint violated on: ${fields.join(", ")}`);
    this.name = "UniqueConstraintError";
    this.fields = fields;
  }
}

export class RecordNotFoundError extends NotFoundError {
  constructor(message = "Record not found") {
    super(message);
    this.name = "RecordNotFoundError";
  }
}

export class ForeignKeyConstraintError extends ValidationError {
  readonly field: string;

  constructor(field: string, message?: string) {
    super(message ?? `Foreign key constraint failed on field: ${field}`);
    this.name = "ForeignKeyConstraintError";
    this.field = field;
  }
}

function extractUniqueFields(meta: Record<string, unknown> | undefined): string[] {
  const target = meta?.target;
  if (Array.isArray(target)) {
    return target.map(String);
  }
  if (typeof target === "string") {
    return [target];
  }
  return [];
}

function extractForeignKeyField(meta: Record<string, unknown> | undefined): string {
  const field = meta?.field_name ?? meta?.constraint;
  return typeof field === "string" ? field : "unknown";
}

export function mapPrismaError(error: unknown): AppError {
  if (error instanceof AppError) {
    return error;
  }

  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    switch (error.code) {
      case "P2002": {
        const fields = extractUniqueFields(error.meta);
        return new UniqueConstraintError(fields, error.message);
      }
      case "P2025":
        return new RecordNotFoundError(error.message);
      case "P2003": {
        const field = extractForeignKeyField(error.meta);
        return new ForeignKeyConstraintError(field, error.message);
      }
      default:
        break;
    }
  }

  if (error instanceof Error) {
    return new AppError(error.message, {
      code: "DATABASE_ERROR",
      statusCode: 500,
      cause: error,
    });
  }

  return new AppError("An unexpected database error occurred", {
    code: "DATABASE_ERROR",
    statusCode: 500,
    cause: error,
  });
}

export async function handlePrisma<T>(operation: () => Promise<T>): Promise<T> {
  try {
    return await operation();
  } catch (error) {
    throw mapPrismaError(error);
  }
}
