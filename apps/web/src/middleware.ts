import { NextResponse, type NextRequest } from 'next/server'
import { updateSession } from '@/lib/supabase/middleware'

export async function middleware(request: NextRequest) {
  // Handle session updates and route protection
  const response = await updateSession(request)
  
  // Public auth routes that should always be accessible
  const publicAuthRoutes = [
    '/auth/login',
    '/auth/register', 
    '/auth/forgot-password',
    '/auth/confirm',
    '/auth/reset-password',
    '/auth/check-email'
  ]
  
  // Redirect authenticated users away from login/register pages only
  if (request.nextUrl.pathname === '/auth/login' || 
      request.nextUrl.pathname === '/auth/register' ||
      request.nextUrl.pathname === '/auth/forgot-password') {
    // Check if user is authenticated by looking for session cookies
    const hasSession = request.cookies.has('sb-access-token') || 
                      request.cookies.has('sb-refresh-token')
    
    if (hasSession) {
      const url = request.nextUrl.clone()
      url.pathname = '/dashboard'
      return NextResponse.redirect(url)
    }
  }

  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}