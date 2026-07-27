import type { PaginatedResult, PaginationInput } from "@/lib/db/types";

export function toSkipTake(pagination: PaginationInput): {
  skip: number;
  take: number;
} {
  const page = Math.max(1, pagination.page);
  const pageSize = Math.max(1, pagination.pageSize);

  return {
    skip: (page - 1) * pageSize,
    take: pageSize,
  };
}

export function buildPaginatedResult<T>(
  items: T[],
  total: number,
  pagination: PaginationInput,
): PaginatedResult<T> {
  const page = Math.max(1, pagination.page);
  const pageSize = Math.max(1, pagination.pageSize);
  const totalPages = total === 0 ? 0 : Math.ceil(total / pageSize);

  return {
    items,
    page,
    pageSize,
    total,
    totalPages,
  };
}
