import type { AuthPayload, AuthRole } from './authToken';

function base64UrlDecode(input: string) {
  const normalized = input.replace(/-/g, '+').replace(/_/g, '/');
  const pad = normalized.length % 4 === 0 ? '' : '='.repeat(4 - (normalized.length % 4));
  const str = atob(normalized + pad);
  return decodeURIComponent(
    Array.prototype.map
      .call(str, (c: string) => '%' + c.charCodeAt(0).toString(16).padStart(2, '0'))
      .join('')
  );
}

// Edge-runtime friendly decoder (does NOT verify signature).
export function decodeAuthToken(token: string): AuthPayload | null {
  try {
    const [bodyB64] = token.split('.');
    if (!bodyB64) return null;
    const bodyStr = base64UrlDecode(bodyB64);
    const parsed = JSON.parse(bodyStr) as Partial<AuthPayload>;
    if (!parsed?.userId || !parsed?.email || !parsed?.storeKey || !parsed?.role || !parsed?.exp) return null;
    if (typeof parsed.role !== 'string') return null;

    if (Date.now() > (parsed.exp as number)) return null;
    return parsed as AuthPayload;
  } catch {
    return null;
  }
}

