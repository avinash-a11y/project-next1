import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(req) {
  // Simplify authentication by handling it at the edge
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const isAuthenticated = !!token;
  
  // Get the pathname from the URL
  const { pathname } = req.nextUrl;

  // Check if this is a dashboard route
  const isDashboardRoute = pathname.startsWith('/dashboard');

  // Redirect unauthenticated users from protected routes to the signin page
  if (isDashboardRoute && !isAuthenticated) {
    console.log('Middleware: Redirecting unauthenticated user from', pathname);
    return NextResponse.redirect(new URL('/signin', req.url));
  }

  // Allow authenticated users to access dashboard
  return NextResponse.next();
}

// Only run middleware on specified paths
export const config = {
  matcher: [
    '/dashboard/:path*',
    '/api/transactions/:path*', 
    '/api/addmoney/:path*',
    '/api/transferto/:path*',
  ],
}; 