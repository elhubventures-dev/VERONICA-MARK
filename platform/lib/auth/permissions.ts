import "server-only";

import type { PermissionScope } from "@prisma/client";

import { ForbiddenError } from "@/lib/errors";
import { prisma } from "@/lib/prisma";
import { logSecurityEvent } from "@/lib/auth/security-log";

export type PermissionKey =
  `${string}:${PermissionScope}` | { resource: string; scope: PermissionScope };

export type UserPermission = {
  resource: string;
  scope: PermissionScope;
};

export async function getUserPermissions(userId: string): Promise<UserPermission[]> {
  const assignments = await prisma.userRoleAssignment.findMany({
    where: {
      userId,
      deletedAt: null,
      role: { deletedAt: null },
    },
    select: {
      role: {
        select: {
          permissions: {
            where: { permission: { deletedAt: null } },
            select: {
              permission: { select: { resource: true, scope: true } },
            },
          },
        },
      },
    },
  });

  const unique = new Map<string, UserPermission>();
  for (const assignment of assignments) {
    for (const relation of assignment.role.permissions) {
      const permission = relation.permission;
      unique.set(`${permission.resource}:${permission.scope}`, permission);
    }
  }
  return [...unique.values()];
}

export async function userHasPermission(
  userId: string,
  resource: string,
  scope: PermissionScope,
): Promise<boolean> {
  const user = await prisma.user.findFirst({
    where: { id: userId, deletedAt: null },
    select: { role: true },
  });
  if (!user) {
    return false;
  }
  if (user.role === "SUPER_ADMIN") {
    return true;
  }

  const permissions = await getUserPermissions(userId);
  return permissions.some(
    (permission) =>
      permission.resource === resource &&
      (permission.scope === scope || permission.scope === "MANAGE"),
  );
}

export async function requirePermission(
  userId: string,
  resource: string,
  scope: PermissionScope,
): Promise<void> {
  if (await userHasPermission(userId, resource, scope)) {
    return;
  }
  await logSecurityEvent({
    type: "PERMISSION_DENIED",
    userId,
    meta: { resource, scope },
  });
  throw new ForbiddenError(`Permission required: ${resource}:${scope}`);
}
