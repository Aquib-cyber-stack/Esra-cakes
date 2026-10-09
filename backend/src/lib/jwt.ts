import jwt from "jsonwebtoken";

export interface AdminTokenPayload {
  id: string;
  email: string;
  role: string;
}

const SECRET = process.env.JWT_SECRET || "dev-secret-change-me";
const EXPIRES_IN = process.env.JWT_EXPIRES_IN || "7d";

export function signAdminToken(payload: AdminTokenPayload): string {
  return jwt.sign(payload, SECRET, { expiresIn: EXPIRES_IN as any });
}

export function verifyAdminToken(token: string): AdminTokenPayload {
  return jwt.verify(token, SECRET) as AdminTokenPayload;
}
