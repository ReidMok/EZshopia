import crypto from 'crypto';

export const AUTH_COOKIE_NAME = 'ezshopia_auth';

export type AuthRole = 'SUPER_ADMIN' | 'MERCHANT_OWNER' | 'MERCHANT_STAFF';

export type AuthPayload = {
  userId: string;
  email: string;
  storeKey: string;
  role: AuthRole;
  exp: number; // unix ms
};

function getAuthSecret() {
  return process.env.AUTH_SECRET || 'dev-auth-secret';
}

function base64UrlEncode(input: Buffer) {
  return input
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/g, '');
}

function base64UrlDecode(input: string) {
  const normalized = input.replace(/-/g, '+').replace(/_/g, '/');
  const pad = normalized.length % 4 === 0 ? '' : '='.repeat(4 - (normalized.length % 4));
  return Buffer.from(normalized + pad, 'base64').toString('utf8');
}

export function signAuthToken(payload: Omit<AuthPayload, 'exp'>, ttlMs: number) {
  const exp = Date.now() + ttlMs;
  const body: AuthPayload = { ...payload, exp };
  const bodyStr = JSON.stringify(body);
  const bodyB64 = base64UrlEncode(Buffer.from(bodyStr, 'utf8'));

  const secret = getAuthSecret();
  const signature = crypto.createHmac('sha256', secret).update(bodyB64).digest('hex');

  return `${bodyB64}.${signature}`;
}

export function verifyAuthToken(token: string): AuthPayload | null {
  try {
    const [bodyB64, signature] = token.split('.');
    if (!bodyB64 || !signature) return null;

    const secret = getAuthSecret();
    const expected = crypto.createHmac('sha256', secret).update(bodyB64).digest('hex');
    if (!crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected))) return null;

    const bodyStr = base64UrlDecode(bodyB64);
    const parsed = JSON.parse(bodyStr) as AuthPayload;
    if (!parsed?.userId || !parsed?.role || !parsed?.exp) return null;
    if (Date.now() > parsed.exp) return null;

    return parsed;
  } catch {
    return null;
  }
}

