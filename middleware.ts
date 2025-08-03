import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Define protected routes (only the protected group routes)
const protectedRoutes = ['/dashboard', '/transactions'];

// Define public routes that should redirect to dashboard if user is authenticated
const publicRoutes = ['/login', '/register'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Check if the current path is a protected route
  const isProtectedRoute = protectedRoutes.some(route => 
    pathname.startsWith(route)
  );
  
  if (isProtectedRoute) {
    // Check for auth token in cookies
    const token = request.cookies.get('auth-token');
    
    if (!token) {
      // Redirect to login page if no token
      const loginUrl = new URL('/login', request.url);
      return NextResponse.redirect(loginUrl);
    }
  }
  
  // If user is authenticated and trying to access login/register pages, redirect to dashboard
  const isPublicRoute = publicRoutes.some(route => pathname.startsWith(route));
  if (isPublicRoute && request.cookies.get('auth-token')) {
    const dashboardUrl = new URL('/dashboard', request.url);
    return NextResponse.redirect(dashboardUrl);
  }
  
  // Allow access to all other routes (home, etc.)
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder files
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.).*)',
  ],
};