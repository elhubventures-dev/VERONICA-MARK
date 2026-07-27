import "server-only";

import { type UserRole } from "@prisma/client";

import { BaseRepository } from "@/lib/repositories/base.repository";
import { NotFoundError } from "@/lib/errors";

export class UserRepository extends BaseRepository {
  async findById(id: string) {
    return this.db.user.findFirst({
      where: { id, deletedAt: null },
    });
  }

  async findByEmail(email: string) {
    return this.db.user.findFirst({
      where: { email: email.toLowerCase(), deletedAt: null },
    });
  }

  async requireById(id: string) {
    const user = await this.findById(id);
    if (!user) {
      throw new NotFoundError("User not found");
    }
    return user;
  }

  async updateRole(id: string, role: UserRole) {
    return this.db.user.update({
      where: { id },
      data: { role },
    });
  }
}

export const userRepository = new UserRepository();
