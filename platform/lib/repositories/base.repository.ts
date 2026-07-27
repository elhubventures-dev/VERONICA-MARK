import "server-only";

import { type Prisma, type PrismaClient } from "@prisma/client";

import { prisma } from "@/lib/prisma";

export type TransactionClient = Prisma.TransactionClient;
export type DbClient = PrismaClient | TransactionClient;

export abstract class BaseRepository {
  protected readonly db: DbClient;

  constructor(client: DbClient = prisma) {
    this.db = client;
  }
}

export { withTransaction, runInTransaction } from "@/lib/db/transactions";
