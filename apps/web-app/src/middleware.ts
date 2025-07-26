/**
 * Next.js middleware for authentication-based route protection.
 * 
 * This middleware provides server-side route protection by validating
 * user sessions before allowing access to protected routes. It follows
 * the Philosophy of Software Design principle of making errors impossible
 * by preventing unauthorized access rather than detecting it after.
 * 
 * The middleware runs on every request matching the specified paths,
 * providing seamless authentication checks without client-side redirects.
 * 
 * @see https://nextjs.org/docs/app/building-your-application/routing/middleware
 * @see https://supabase.com/docs/guides/auth/server-side/nextjs
 */

import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { createServerClient } from '@supabase/ssr'

/**
 * Authentication middleware that protects routes based on user session.
 * 
 * This middleware runs on the server before pages are rendered, providing
 * fast and secure authentication checks. It handles both protected routes
 * (requiring authentication) and public routes (redirecting authenticated users).
 * 
 * Protected routes: /dashboard, /profile, /settings, etc.
 * Public auth routes: /auth/login, /auth/register (redirect if authenticated)
 * 
 * @param request - Next.js request object with URL and headers
 * @returns Response object with redirect or continuation
 */
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  try {
    let response = NextResponse.next({
      request: {
        headers: request.headers,
      },
    })

    // Create server-side Supabase client for session validation
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll()
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
            response = NextResponse.next({
              request,
            })
            cookiesToSet.forEach(({ name, value, options }) =>
              response.cookies.set(name, value, options)
            )
          },
        },
      }
    )

    // Refresh session if expired - this is important for preventing AuthSessionMissingError
    const { data: { user }, error } = await supabase.auth.getUser()

    // Log authentication state for debugging (remove in production)
    console.log('Middleware - Path:', pathname, 'Authenticated:', !!user)

    // Define route categories for different protection logic
    const isAuthRoute = pathname.startsWith('/auth/')
    const isProtectedRoute = [
      '/dashboard',
      '/profile',
      '/settings',
      '/workouts',
    ].some(route => pathname.startsWith(route))

    const isPublicRoute = [
      '/',
      '/about',
      '/contact',
      '/privacy',
      '/terms',
    ].includes(pathname)

    /**
     * Handle authentication routes (login, register, etc.)
     * 
     * If user is already authenticated, redirect to dashboard to prevent
     * unnecessary authentication flows. This improves UX by avoiding
     * confusion when users bookmark auth pages.
     */
    if (isAuthRoute) {
      if (user) {
        console.log('Middleware - Redirecting authenticated user from auth route to dashboard')
        return NextResponse.redirect(new URL('/dashboard', request.url))
      }
      
      // Allow access to auth routes for unauthenticated users
      return response
    }

    /**
     * Handle protected routes requiring authentication.
     * 
     * Validate session and redirect to login if user is not authenticated.
     * This prevents access to sensitive areas without proper authentication.
     */
    if (isProtectedRoute) {
      if (!user || error) {
        console.log('Middleware - Redirecting unauthenticated user to login')
        
        // Preserve the intended destination for post-login redirect
        const redirectUrl = new URL('/auth/login', request.url)
        redirectUrl.searchParams.set('redirectTo', pathname)
        
        return NextResponse.redirect(redirectUrl)
      }

      // Allow access to protected routes for authenticated users
      return response
    }

    /**
     * Handle public routes accessible to all users.
     * 
     * These routes are available regardless of authentication status.
     * No special handling needed, just continue with the request.
     */
    if (isPublicRoute) {
      return response
    }

    /**
     * Handle undefined routes - default to allowing access.
     * 
     * For routes not explicitly defined above, allow access.
     * This prevents breaking functionality for routes we haven't
     * considered yet while maintaining security for known protected routes.
     */
    return response

  } catch (error) {
    /**
     * Handle middleware errors gracefully.
     * 
     * If authentication check fails due to network issues or other errors,
     * log the error but allow the request to continue. This prevents the
     * entire site from breaking due to authentication service issues.
     */
    console.error('Middleware error:', error)
    
    // For protected routes, err on the side of security
    const isProtectedRoute = [
      '/dashboard',
      '/profile',
      '/settings',
      '/workouts',
    ].some(route => pathname.startsWith(route))

    if (isProtectedRoute) {
      console.log('Middleware - Error occurred, redirecting to login for safety')
      return NextResponse.redirect(new URL('/auth/login', request.url))
    }

    // For other routes, continue despite the error
    return NextResponse.next()
  }
}

/**
 * Middleware configuration specifying which routes to run on.
 * 
 * Only runs middleware on routes that actually need authentication checks:
 * - Protected routes requiring authentication (/dashboard, /profile, etc.)
 * - Auth routes where we redirect authenticated users (/auth/*)
 * 
 * This optimizes performance by not running middleware on:
 * - Public routes (/, /about, etc.)
 * - Static assets and API routes
 * - Next.js internal routes
 */
export const config = {
  matcher: [
    // Protected routes that require authentication
    '/dashboard/:path*',
    '/profile/:path*',
    '/settings/:path*',
    '/workouts/:path*',
    
    // Auth routes where we redirect authenticated users
    '/auth/login',
    '/auth/register',
    '/auth/forgot-password',
    '/auth/reset-password',
    '/auth/callback',
  ],
}

/**
 * Utility functions for middleware logic.
 */
export const middlewareUtils = {
  /**
   * Extract redirect destination from login URL parameters.
   * 
   * Helper function to handle post-login redirects by extracting
   * the intended destination from URL search parameters.
   * 
   * @param url - Current request URL
   * @returns Redirect destination or default dashboard path
   */
  getRedirectDestination: (url: string): string => {
    try {
      const urlObj = new URL(url)
      const redirectTo = urlObj.searchParams.get('redirectTo')
      
      // Validate redirect destination to prevent open redirect attacks
      if (redirectTo && redirectTo.startsWith('/') && !redirectTo.startsWith('//')) {
        return redirectTo
      }
      
      return '/dashboard'
    } catch {
      return '/dashboard'
    }
  },

  /**
   * Check if session is expired or about to expire.
   * 
   * Helper function to validate session freshness and prevent
   * using expired sessions for authentication decisions.
   * 
   * @param session - Supabase session object
   * @returns True if session is expired or expiring soon
   */
  isSessionExpired: (session: any): boolean => {
    if (!session?.expires_at) return true
    
    // Add 5 minute buffer before actual expiration
    const expirationBuffer = 5 * 60 * 1000 // 5 minutes in milliseconds
    const expirationTime = session.expires_at * 1000 - expirationBuffer
    
    return Date.now() >= expirationTime
  },
}