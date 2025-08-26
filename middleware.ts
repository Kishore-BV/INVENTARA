import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value;
  const { pathname } = request.nextUrl;

  // Always allow API routes to pass through (avoid HTML redirects from API calls)
  if (pathname.startsWith('/api/')) {
    return NextResponse.next();
  }

  // Public routes that don't require authentication
  const publicRoutes = ['/login', '/forgot-password', '/auth/login', '/auth/forgot'];
  const isPublicRoute = publicRoutes.some(route => 
    pathname === route || pathname.startsWith(`${route}/`)
  );

  // If authenticated, keep users away from login/register pages
  if (token && (pathname === '/login' || pathname.startsWith('/auth/login'))) {
    const url = new URL('/dashboard', request.url);
    return NextResponse.redirect(url);
  }

  // If it's a public route, continue
  if (isPublicRoute) {
    return NextResponse.next();
  }

  // If there's no token and it's not a public route, redirect to login
  if (!token) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

// Configure which routes the middleware will run on
export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
