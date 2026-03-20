import type { NextRequest } from 'next/server';
import { AUTH_COOKIE_NAME, type AuthPayload, verifyAuthToken } from './authToken';

export function getAuthFromRequest(req: NextRequest): AuthPayload | null {
  const token = req.cookies.get(AUTH_COOKIE_NAME)?.value;
  if (!token) return null;
  return verifyAuthToken(token);
}

export function requireAuth(req: NextRequest): AuthPayload | null {
  return getAuthFromRequest(req);
}

export function isRoleAllowed(auth: AuthPayload, allowed: Array<AuthPayload['role']>) {
  return allowed.includes(auth.role);
}

