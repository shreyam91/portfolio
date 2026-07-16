import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)',
  ],
};

export function middleware(req: NextRequest) {
  const url = req.nextUrl.clone();
  
  // Get hostname (e.g., codestreak.shreyam.online, codestreak.localhost:3000)
  const hostname = req.headers.get('host') || '';

  // Check if we are on the codestreak subdomain
  const isCodestreakSubdomain = 
    hostname === 'codestreak.shreyam.online' || 
    hostname.startsWith('codestreak.localhost');

  if (isCodestreakSubdomain) {
    // If we're on the subdomain and the path doesn't already have /codestreak
    // we rewrite it to serve from /codestreak folder internally
    if (!url.pathname.startsWith('/codestreak')) {
      url.pathname = `/codestreak${url.pathname === '/' ? '' : url.pathname}`;
      return NextResponse.rewrite(url);
    }
  }

  return NextResponse.next();
}
