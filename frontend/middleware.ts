import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export const config = {
  matcher: [
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
    if (!url.pathname.startsWith('/codestreak')) {
      url.pathname = `/codestreak${url.pathname === '/' ? '' : url.pathname}`;
      return NextResponse.rewrite(url);
    }
  } else {
    // If we are on the main domain and requesting /codestreak
    if (url.pathname.startsWith('/codestreak')) {
      const isLocal = hostname.includes('localhost');
      const targetHost = isLocal ? `http://codestreak.${hostname}` : `https://codestreak.shreyam.online`;
      const newUrl = new URL(url.pathname.replace('/codestreak', ''), targetHost);
      if (newUrl.pathname === '') newUrl.pathname = '/';
      return NextResponse.redirect(newUrl);
    }
  }

  return NextResponse.next();
}
