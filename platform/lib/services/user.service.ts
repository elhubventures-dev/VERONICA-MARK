import "server-only";

import { DomainService } from "@/lib/domain/base.service";
import { userRepository } from "@/lib/repositories/user.repository";

export class UserService extends DomainService {
  async getProfile(userId: string) {
    const user = await userRepository.requireById(userId);
    return {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
      preferredCurrency: user.preferredCurrency,
    };
  }
}

export const userService = new UserService();
