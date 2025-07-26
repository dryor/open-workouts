/**
 * Authentication callback component that uses useSearchParams.
 * 
 * This component is separated from the page to allow wrapping in Suspense
 * boundary, which is required for Next.js 15 static optimization when
 * using useSearchParams().
 */

'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { toast } from 'sonner'
import { createClient } from '@/lib/auth/client'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

/**
 * Authentication callback component.
 * 
 * Handles various authentication callbacks including:
 * - Email verification confirmations
 * - Password reset token processing
 * - OAuth provider redirects (when implemented)
 * - Error handling for invalid or expired tokens
 */
export function AuthCallbackComponent() {
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const router = useRouter()
  const searchParams = useSearchParams()

  /**
   * Process authentication callback on component mount.
   * 
   * Extracts authentication tokens from URL parameters and processes
   * them through Supabase Auth. Handles different callback types and
   * provides appropriate user feedback and redirects.
   */
  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        const supabase = createClient()
        
        // Extract auth tokens from URL hash and search params
        const hashFragment = window.location.hash
        const urlParams = new URLSearchParams(window.location.search)
        
        // Check for error parameters first
        const errorParam = urlParams.get('error')
        const errorDescription = urlParams.get('error_description')
        
        if (errorParam) {
          throw new Error(errorDescription || errorParam)
        }

        // Process the authentication session from URL
        const { data, error: authError } = await supabase.auth.getSession()

        if (authError) {
          throw authError
        }

        // Determine callback type and handle accordingly
        const type = urlParams.get('type')
        
        switch (type) {
          case 'signup':
            // Email verification callback
            if (data.session) {
              setSuccess('Email verified successfully! Welcome to Open Workouts.')
              toast.success('Email verified!', {
                description: 'Your account is now active. Redirecting to dashboard...',
                duration: 4000,
              })
              
              // Redirect to dashboard after brief delay
              setTimeout(() => {
                router.push('/dashboard')
              }, 2000)
            } else {
              throw new Error('Email verification failed. Please try clicking the link again.')
            }
            break

          case 'recovery':
            // Password reset callback - redirect to reset password form
            setSuccess('Password reset link verified. You can now set your new password.')
            toast.success('Reset link verified', {
              description: 'Redirecting to password reset form...',
              duration: 3000,
            })
            
            setTimeout(() => {
              router.push('/auth/reset-password')
            }, 1500)
            break

          case 'invite':
            // Team invitation callback (future feature)
            setSuccess('Invitation accepted! Please complete your account setup.')
            setTimeout(() => {
              router.push('/dashboard')
            }, 2000)
            break

          default:
            // Generic callback - check if user is authenticated
            if (data.session) {
              setSuccess('Authentication successful!')
              toast.success('Welcome back!', {
                description: 'Redirecting to dashboard...',
                duration: 3000,
              })
              
              setTimeout(() => {
                router.push('/dashboard')
              }, 1500)
            } else {
              // No session found, redirect to login
              toast.info('Session expired', {
                description: 'Please sign in again',
                duration: 4000,
              })
              
              setTimeout(() => {
                router.push('/auth/login')
              }, 2000)
            }
        }

      } catch (error: any) {
        console.error('Auth callback error:', error)
        
        // Set user-friendly error message
        const errorMessage = error.message || 'An error occurred during authentication'
        setError(errorMessage)
        
        // Show error toast
        toast.error('Authentication failed', {
          description: errorMessage,
          duration: 6000,
        })

      } finally {
        setIsLoading(false)
      }
    }

    handleAuthCallback()
  }, [router, searchParams])

  /**
   * Handle retry for failed authentication attempts.
   * 
   * Allows users to retry the authentication process or navigate
   * to alternative flows when the callback fails.
   */
  const handleRetry = () => {
    setIsLoading(true)
    setError(null)
    window.location.reload()
  }

  /**
   * Navigate back to login page.
   * 
   * Provides escape route for users when authentication callback
   * fails or they want to try a different authentication method.
   */
  const handleBackToLogin = () => {
    router.push('/auth/login')
  }

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-xl font-semibold">
              {isLoading ? 'Processing...' : error ? 'Authentication Failed' : 'Success!'}
            </CardTitle>
            <CardDescription>
              {isLoading 
                ? 'Please wait while we process your authentication'
                : error 
                  ? 'There was a problem with your authentication'
                  : 'Authentication completed successfully'
              }
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            {isLoading && (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            )}

            {error && (
              <>
                <div className="rounded-lg bg-red-50 p-4 text-sm text-red-800 dark:bg-red-950 dark:text-red-200">
                  <p className="font-medium mb-1">Authentication Error</p>
                  <p>{error}</p>
                </div>

                <div className="flex flex-col gap-2">
                  <Button onClick={handleRetry} className="w-full">
                    Try Again
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={handleBackToLogin}
                    className="w-full"
                  >
                    Back to Login
                  </Button>
                </div>
              </>
            )}

            {success && (
              <div className="rounded-lg bg-green-50 p-4 text-sm text-green-800 dark:bg-green-950 dark:text-green-200">
                <p className="font-medium mb-1">Success!</p>
                <p>{success}</p>
                <p className="mt-2 text-xs opacity-75">
                  You will be redirected automatically...
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}