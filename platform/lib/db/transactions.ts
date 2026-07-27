import "server-only";

import { type Prisma, type PrismaClient } from "@prisma/client";

import { prisma } from "@/lib/prisma";

export type TransactionClient = Prisma.TransactionClient;

export type TransactionOptions = {
  maxWait?: number;
  timeout?: number;
  isolationLevel?: Prisma.TransactionIsolationLevel;
};

const DEFAULT_TRANSACTION_OPTIONS: TransactionOptions = {
  maxWait: 5_000,
  timeout: 15_000,
};

export async function withTransaction<T>(
  callback: (tx: TransactionClient) => Promise<T>,
  options: TransactionOptions = {},
): Promise<T> {
  const merged = { ...DEFAULT_TRANSACTION_OPTIONS, ...options };

  return prisma.$transaction(callback, {
    maxWait: merged.maxWait,
    timeout: merged.timeout,
    isolationLevel: merged.isolationLevel,
  });
}

export async function runInTransaction<T>(
  client: PrismaClient | TransactionClient,
  callback: (tx: TransactionClient) => Promise<T>,
  options: TransactionOptions = {},
): Promise<T> {
  if ("$transaction" in client && typeof client.$transaction === "function") {
    const merged = { ...DEFAULT_TRANSACTION_OPTIONS, ...options };
    return client.$transaction(callback, {
      maxWait: merged.maxWait,
      timeout: merged.timeout,
      isolationLevel: merged.isolationLevel,
    });
  }

  return callback(client as TransactionClient);
}
