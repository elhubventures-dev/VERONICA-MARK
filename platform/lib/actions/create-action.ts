import { type ZodSchema } from "zod";
import { type UserRole } from "@prisma/client";

import { auth } from "@/lib/auth";
import { hasRequiredRole } from "@/lib/auth/rbac";
import {
  AppError,
  ForbiddenError,
  UnauthorizedError,
  ValidationError,
  toErrorResponse,
} from "@/lib/errors";
import { logger } from "@/lib/logger";

export type ActionSuccess<T> = {
  success: true;
  data: T;
};

export type ActionFailure = {
  success: false;
  error: {
    code: string;
    message: string;
    details?: unknown;
  };
};

export type ActionResult<T> = ActionSuccess<T> | ActionFailure;

type ActionContext = {
  userId: string;
  role: UserRole;
  email: string;
};

type ActionOptions<TInput> = {
  schema?: ZodSchema<TInput>;
  roles?: UserRole[];
  requireAuth?: boolean;
};

export function createAction<TInput, TOutput>(
  name: string,
  options: ActionOptions<TInput>,
  handler: (input: TInput, context: ActionContext | null) => Promise<TOutput>,
): (rawInput: TInput) => Promise<ActionResult<TOutput>> {
  return async (rawInput: TInput): Promise<ActionResult<TOutput>> => {
    try {
      let context: ActionContext | null = null;
      const requireAuth = options.requireAuth ?? Boolean(options.roles?.length);

      if (requireAuth || options.roles?.length) {
        const session = await auth();
        if (!session?.user?.id) {
          throw new UnauthorizedError();
        }

        if (options.roles && !hasRequiredRole(session.user.role, options.roles)) {
          throw new ForbiddenError();
        }

        context = {
          userId: session.user.id,
          role: session.user.role,
          email: session.user.email,
        };
      }

      const input = options.schema ? options.schema.parse(rawInput) : rawInput;
      const data = await handler(input, context);

      logger.info({ action: name, userId: context?.userId }, "action.success");
      return { success: true, data };
    } catch (error) {
      if (error instanceof AppError) {
        logger.warn({ action: name, code: error.code, details: error.details }, "action.failed");
      } else if (
        error &&
        typeof error === "object" &&
        "name" in error &&
        error.name === "ZodError"
      ) {
        const validation = new ValidationError("Invalid input", error);
        logger.warn({ action: name, details: validation.details }, "action.validation_failed");
        return {
          success: false,
          error: {
            code: validation.code,
            message: validation.message,
            details: validation.details,
          },
        };
      } else {
        logger.error({ action: name, err: error }, "action.unexpected_error");
      }

      const response = toErrorResponse(error);
      return { success: false, error: response.body.error };
    }
  };
}
