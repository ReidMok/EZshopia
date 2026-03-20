export type ClientSession = {
  userId: string;
  storeKey: string;
  role: 'MERCHANT_OWNER';
};

const SESSION_KEY = 'ezshopia_session';

export function getClientSession(): ClientSession | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = window.localStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed?.userId || !parsed?.storeKey) return null;
    return parsed as ClientSession;
  } catch {
    return null;
  }
}

export function setClientSession(session: ClientSession) {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(SESSION_KEY, JSON.stringify(session));
}

export function clearClientSession() {
  if (typeof window === 'undefined') return;
  window.localStorage.removeItem(SESSION_KEY);
}

