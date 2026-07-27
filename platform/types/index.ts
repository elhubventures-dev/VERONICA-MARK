import { type UserRole, type Currency } from "@prisma/client";

export type LocaleCode = "en" | "fr" | "ar" | "es" | "ha" | "ig" | "yo";

export type SupportedCurrency = Currency;

export type AuthenticatedUser = {
  id: string;
  email: string;
  role: UserRole;
  firstName?: string;
  lastName?: string;
};

export type PaginatedResult<T> = {
  items: T[];
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
};

export type ApiErrorBody = {
  error: {
    code: string;
    message: string;
    details?: unknown;
  };
};
