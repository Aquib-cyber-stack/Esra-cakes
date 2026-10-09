import bcrypt from "bcryptjs";
import { Request, Response } from "express";
import { prisma } from "../lib/prisma";
import { signAdminToken } from "../lib/jwt";
import { asyncHandler, ApiError } from "../middleware/errorHandler";
import { AuthedRequest } from "../middleware/auth";

const COOKIE_NAME = process.env.COOKIE_NAME || "esra_admin_token";
const isProd = process.env.NODE_ENV === "production";

export const login = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const admin = await prisma.admin.findUnique({ where: { email } });
  if (!admin) throw new ApiError(401, "Invalid email or password.");

  const valid = await bcrypt.compare(password, admin.passwordHash);
  if (!valid) throw new ApiError(401, "Invalid email or password.");

  const token = signAdminToken({ id: admin.id, email: admin.email, role: admin.role });

  res.cookie(COOKIE_NAME, token, {
    httpOnly: true,
    secure: isProd,
    sameSite: "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  res.json({
    token, // also returned so an SPA can store it if cookies are blocked cross-site
    admin: { id: admin.id, name: admin.name, email: admin.email, role: admin.role },
  });
});

export const logout = asyncHandler(async (_req: Request, res: Response) => {
  res.clearCookie(COOKIE_NAME);
  res.json({ success: true });
});

export const me = asyncHandler(async (req: AuthedRequest, res: Response) => {
  const admin = await prisma.admin.findUnique({ where: { id: req.admin!.id } });
  if (!admin) throw new ApiError(401, "Session no longer valid.");
  res.json({ admin: { id: admin.id, name: admin.name, email: admin.email, role: admin.role } });
});
