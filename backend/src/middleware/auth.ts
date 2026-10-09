import { NextFunction, Request, Response } from "express";
import { verifyAdminToken } from "../lib/jwt";
import { ApiError } from "./errorHandler";

export interface AuthedRequest extends Request {
  admin?: { id: string; email: string; role: string };
}

const COOKIE_NAME = process.env.COOKIE_NAME || "esra_admin_token";

export function requireAdmin(req: AuthedRequest, res: Response, next: NextFunction) {
  const bearer = req.headers.authorization?.startsWith("Bearer ")
    ? req.headers.authorization.slice(7)
    : undefined;
  const token = req.cookies?.[COOKIE_NAME] || bearer;

  if (!token) {
    throw new ApiError(401, "Authentication required.");
  }

  try {
    const payload = verifyAdminToken(token);
    req.admin = payload;
    next();
  } catch {
    throw new ApiError(401, "Invalid or expired session. Please log in again.");
  }
}
