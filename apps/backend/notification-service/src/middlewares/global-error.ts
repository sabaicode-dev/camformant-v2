import {
  ApplicationError,
  AUTH_MESSAGES,
  HTTP_STATUS_CODE,
  prettyObject,
} from "@sabaicode-dev/camformant-libs";
import { NextFunction, Request, Response } from "express";

export function globalErrorHandler(
  error: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
) {
  // Handle Error
  if (error instanceof ApplicationError) {
    const status = error.status;
    const message = error.message;
    const errors = error.errors;

    console.error(
      `$NotificationService - globalErrorHandler() method error: `,
      prettyObject(error)
    );
    return res.status(status).json({ message, error: errors });
  }

  // Unhandle Error
  console.error(
    `$NotificationService - globalErrorHandler() method unexpected error: `,
    prettyObject(error as {})
  );
  res
    .status(HTTP_STATUS_CODE.SERVER_ERROR)
    .json({ message: AUTH_MESSAGES.AUTHENTICATION.EMAIL_ALREADY_IN_USE });
}
