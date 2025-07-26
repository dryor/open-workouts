/**
 * Forgot password form component for password reset initiation.
 * 
 * This component handles the first step of password recovery by collecting
 * the user's email address and sending a secure password reset link via
 * Supabase Auth. Includes comprehensive form validation and user feedback.
 * 
 * The reset link contains a time-limited secure token that allows the user
 * to set a new password without compromising account security.
 */

'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import Link from 'next/link'
import { toast } from 'sonner'
import { ArrowLeft } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'

import { useAuth } from '@/hooks/use-auth'
import { passwordResetSchema, PasswordResetFormData } from '@/lib/auth/validation'

/**
 * Forgot password form component with email-based password reset.
 * 
 * Provides password reset functionality including:
 * - Email validation and submission
 * - Reset link sending via Supabase Auth
 * - Success state with user instructions
 * - Error handling with user-friendly messages
 * - Navigation back to login form
 */
export function ForgotPasswordForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [isResetSent, setIsResetSent] = useState(false)
  const [resetEmail, setResetEmail] = useState('')
  const { resetPassword } = useAuth()

  /**
   * Initialize React Hook Form with password reset validation schema.
   * 
   * Simple email validation to ensure we can send the reset link
   * to a valid email address.
   */
  const form = useForm<PasswordResetFormData>({
    resolver: zodResolver(passwordResetSchema),
    defaultValues: {
      email: '',
    },
    mode: 'onBlur',
  })

  /**
   * Handle password reset form submission.
   * 
   * Sends password reset email via Supabase Auth and provides user
   * feedback. Shows success state with instructions for completing
   * the password reset process.
   * 
   * @param data - Validated form data containing email address
   */
  const onSubmit = async (data: PasswordResetFormData) => {
    try {
      setIsLoading(true)

      // Show loading toast for immediate feedback
      const loadingToast = toast.loading('Sending reset link...', {
        description: 'Please wait while we send the password reset email',
      })

      // Request password reset email from Supabase
      const result = await resetPassword(data)

      // Dismiss loading toast
      toast.dismiss(loadingToast)

      if (result.error) {
        // Show error toast with specific error message
        toast.error('Reset request failed', {
          description: result.error,
          duration: 6000,
        })
        return
      }

      // Success - show confirmation state
      setResetEmail(data.email)
      setIsResetSent(true)
      
      // Show success toast
      toast.success('Reset link sent!', {
        description: 'Please check your email for password reset instructions',
        duration: 6000,
      })

    } catch (error) {
      console.error('Password reset form error:', error)
      
      // Show generic error toast for unexpected errors
      toast.error('Something went wrong', {
        description: 'An unexpected error occurred. Please try again.',
        duration: 5000,
      })
    } finally {
      setIsLoading(false)
    }
  }

  /**
   * Handle resending password reset email.
   * 
   * Allows user to request another reset email if they don't receive
   * the first one or if it expires.
   */
  const handleResendEmail = async () => {
    if (!resetEmail) return

    try {
      setIsLoading(true)

      const loadingToast = toast.loading('Resending reset link...', {
        description: 'Sending another password reset email',
      })

      const result = await resetPassword({ email: resetEmail })

      toast.dismiss(loadingToast)

      if (result.error) {
        toast.error('Failed to resend', {
          description: result.error,
          duration: 5000,
        })
        return
      }

      toast.success('Reset link resent!', {
        description: 'Please check your email again',
        duration: 4000,
      })

    } catch (error) {
      console.error('Resend reset email error:', error)
      toast.error('Something went wrong', {
        description: 'Failed to resend reset email. Please try again.',
        duration: 5000,
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Show success state after reset email is sent
  if (isResetSent) {
    return (
      <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
        <div className="w-full max-w-sm">
          <Card>
            <CardHeader className="text-center">
              <CardTitle className="text-xl font-semibold text-blue-600">
                Check your email
              </CardTitle>
              <CardDescription>
                We&apos;ve sent password reset instructions to {resetEmail}
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="rounded-lg bg-blue-50 p-4 text-sm text-blue-800 dark:bg-blue-950 dark:text-blue-200">
                <p className="font-medium mb-2">Next steps:</p>
                <ol className="list-decimal list-inside space-y-1">
                  <li>Check your email inbox and spam folder</li>
                  <li>Click the password reset link in the email</li>
                  <li>Enter your new password on the reset page</li>
                  <li>Sign in with your new password</li>
                </ol>
              </div>

              <div className="text-center text-sm text-muted-foreground">
                Didn&apos;t receive the email?{' '}
                <Button
                  type="button"
                  variant="link"
                  className="h-auto p-0 text-sm"
                  onClick={handleResendEmail}
                  disabled={isLoading}
                >
                  Send again
                </Button>
              </div>

              <div className="text-center">
                <Link 
                  href="/auth/login"
                  className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground"
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to login
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-xl font-semibold">
              Forgot your password?
            </CardTitle>
            <CardDescription>
              Enter your email address and we&apos;ll send you a link to reset your password
            </CardDescription>
          </CardHeader>

          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                {/* Email Field */}
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input 
                          {...field}
                          type="email"
                          placeholder="m@example.com"
                          disabled={isLoading}
                          autoComplete="email"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Submit Button */}
                <Button 
                  type="submit" 
                  className="w-full" 
                  disabled={isLoading}
                >
                  {isLoading ? 'Sending...' : 'Send reset link'}
                </Button>
              </form>
            </Form>

            {/* Back to Login Link */}
            <div className="mt-4 text-center">
              <Link 
                href="/auth/login"
                className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to login
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}