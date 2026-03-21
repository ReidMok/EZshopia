import { NextRequest, NextResponse } from 'next/server';
import { AUTH_COOKIE_NAME } from './lib/authToken';
import { decodeAuthToken } from './lib/authTokenDecode';

// NOTE: Do NOT import jsonDb here. Middleware runs in Edge runtime and cannot use Node fs/path/crypto.
// Custom domain mapping (getStoreKeyByHostname) is disabled in middleware until we have an Edge-safe solution.

const ROOT_DOMAIN = 'ezshopia.com';
const PLATFORM_SUBDOMAIN = 'admin';

function getHostname(req: NextRequest) {
  const host = req.headers.get('host') || '';
  return host.split(':')[0].toLowerCase();
}

function isLocalhost(hostname: string) {
  return hostname === 'localhost' || hostname === '127.0.0.1' || hostname.endsWith('.localhost');
}

function extractStoreFromHostname(hostname: string) {
  // Production: {store}.ezshopia.com
  if (hostname.endsWith(`.${ROOT_DOMAIN}`)) {
    const sub = hostname.slice(0, -1 * (`.${ROOT_DOMAIN}`.length));
    if (!sub || sub === 'www' || sub === PLATFORM_SUBDOMAIN) return null;
    // Only use the left-most label as store key (brand.us.ezshopia.com -> brand)
    return sub.split('.')[0];
  }

  // Local dev: {store}.localhost
  if (hostname.endsWith('.localhost')) {
    const sub = hostname.slice(0, -'.localhost'.length);
    if (!sub || sub === PLATFORM_SUBDOMAIN) return null;
    return sub.split('.')[0];
  }

  return null;
}

export async function middleware(req: NextRequest) {
  const { nextUrl } = req;
  const hostname = getHostname(req);
  const pathname = nextUrl.pathname;

  // Basic admin authorization (cookie-based).
  // This runs before any rewrites so we can redirect early.
  const authToken = req.cookies.get(AUTH_COOKIE_NAME)?.value;
  const auth = authToken ? decodeAuthToken(authToken) : null;

  const isPlatformAdmin = hostname === `${PLATFORM_SUBDOMAIN}.${ROOT_DOMAIN}` || (isLocalhost(hostname) && hostname === `${PLATFORM_SUBDOMAIN}.localhost`);
  const storeFromPathMode = pathname.startsWith('/s/') && pathname.endsWith('/admin') ? pathname.split('/')[2] : null;

  // Store admin on host root: {storeKey}.ezshopia.com/admin (subdomain mode only; custom domain mapping disabled in Edge)
  const isStoreAdminHost = !isPlatformAdmin && (pathname === '/admin' || pathname.startsWith('/admin/'));
  const storeFromHost = extractStoreFromHostname(hostname);

  if (isPlatformAdmin) {
    if (!auth || auth.role !== 'SUPER_ADMIN') {
      const url = nextUrl.clone();
      url.pathname = '/sign-in';
      return NextResponse.redirect(url);
    }
  }

  const isStoreAdminRequest = !!storeFromPathMode || (!!storeFromHost && isStoreAdminHost);
  if (!isPlatformAdmin && isStoreAdminRequest) {
    const storeKeyToCheck = storeFromPathMode || storeFromHost;
    if (!auth || (auth.role !== 'MERCHANT_OWNER' && auth.role !== 'MERCHANT_STAFF') || auth.storeKey !== storeKeyToCheck) {
      const url = nextUrl.clone();
      url.pathname = '/sign-in';
      return NextResponse.redirect(url);
    }
  }

  // Skip Next internals + assets
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/sign-in') ||
    pathname.startsWith('/sign-up') ||
    pathname.startsWith('/favicon') ||
    pathname.startsWith('/robots.txt') ||
    pathname.startsWith('/sitemap') ||
    pathname.startsWith('/api')
  ) {
    return NextResponse.next();
  }

  // Platform subdomain -> /admin
  if (hostname === `${PLATFORM_SUBDOMAIN}.${ROOT_DOMAIN}` || (isLocalhost(hostname) && hostname === `${PLATFORM_SUBDOMAIN}.localhost`)) {
    const url = nextUrl.clone();
    url.pathname = `/admin${pathname === '/' ? '' : pathname}`;
    return NextResponse.rewrite(url);
  }

  // Store host mapping -> /s/{store} (subdomain mode: {store}.ezshopia.com)
  const store = storeFromHost;
  if (store) {
    const url = nextUrl.clone();
    url.pathname = `/s/${store}${pathname === '/' ? '' : pathname}`;
    return NextResponse.rewrite(url);
  }

  // Root domain - leave as-is (marketing site or dev entry)
  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/|.*\\..*).*)'],
  runtime: 'nodejs',
};

