export type SortDirection = "asc" | "desc";

export type PaginationInput = {
  page: number;
  pageSize: number;
};

export type PaginatedResult<T> = {
  items: T[];
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
};

/** Prisma `where` fragment for entities that support soft delete. */
export type SoftDeleteFilter = {
  deletedAt: null;
};

export type WithDeletedOption = {
  withDeleted?: boolean;
};
