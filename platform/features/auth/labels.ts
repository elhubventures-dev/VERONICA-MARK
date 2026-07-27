import type { UserRole } from "@prisma/client";

export function formatRoleLabel(role: UserRole): string {
  switch (role) {
    case "CUSTOMER":
      return "Customer";
    case "BRAND_MANAGER":
      return "Brand Manager";
    case "SUPER_ADMIN":
      return "Super Admin";
    default:
      return role;
  }
}
