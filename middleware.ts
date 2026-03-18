import { NextRequest, NextResponse } from 'next/server';

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

export function middleware(req: NextRequest) {
  const { nextUrl } = req;
  const hostname = getHostname(req);
  const pathname = nextUrl.pathname;

  // Skip Next internals + assets
  if (
    pathname.startsWith('/_next') ||
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

  // Store subdomains -> /s/{store}
  const store = extractStoreFromHostname(hostname);
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
};

