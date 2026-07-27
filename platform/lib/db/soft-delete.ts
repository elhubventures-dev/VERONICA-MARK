import type { SoftDeleteFilter, WithDeletedOption } from "@/lib/db/types";

export const NOT_DELETED: SoftDeleteFilter = { deletedAt: null };

export function notDeleted(): SoftDeleteFilter {
  return NOT_DELETED;
}

export function mergeSoftDeleteFilter<T extends Record<string, unknown>>(
  where: T,
  options: WithDeletedOption = {},
): T | (T & SoftDeleteFilter) {
  if (options.withDeleted) {
    return where;
  }

  return { ...where, ...NOT_DELETED };
}

export function withDeleted<T extends Record<string, unknown>>(
  where: T,
): T {
  const { deletedAt: _deletedAt, ...rest } = where as T & {
    deletedAt?: unknown;
  };
  return rest as T;
}
