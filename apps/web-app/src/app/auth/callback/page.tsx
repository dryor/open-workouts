/**
 * Authentication callback page for email verification and OAuth flows.
 * 
 * This page handles the callback from Supabase authentication flows,
 * particularly email verification links and OAuth provider redirects.
 * It processes the authentication tokens and redirects users appropriately.
 * 
 * The page automatically handles token exchange and session establishment
 * without requiring user interaction, providing a seamless auth experience.
 */

import { Suspense } from 'react'
import { AuthCallbackComponent } from './auth-callback-component'

/**
 * Authentication callback page with Suspense boundary.
 * 
 * Wraps the callback component in Suspense to handle useSearchParams()
 * requirement for Next.js 15 static optimization.
 */
export default function AuthCallbackPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
          <div className="w-full max-w-sm">
            <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
              <div className="flex flex-col space-y-1.5 p-6 text-center">
                <h3 className="text-xl font-semibold">Processing...</h3>
                <p className="text-sm text-muted-foreground">
                  Please wait while we handle your authentication
                </p>
              </div>
              <div className="p-6 pt-0 flex justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            </div>
          </div>
        </div>
      }
    >
      <AuthCallbackComponent />
    </Suspense>
  )
}