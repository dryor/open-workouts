/**
 * Reset password form component for completing password recovery.
 * 
 * This component handles the final step of password reset by allowing users
 * to set a new password using the secure token from the reset email link.
 * Includes password confirmation validation and comprehensive user feedback.
 * 
 * The form automatically extracts the reset token from URL parameters that
 * Supabase includes when users click the reset link from their email.
 */

'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { toast } from 'sonner'
import { ArrowLeft, Eye, EyeOff } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'

import { useAuth } from '@/hooks/use-auth'
import { newPasswordSchema, NewPasswordFormData } from '@/lib/auth/validation'

/**
 * Reset password form component with secure token validation.
 * 
 * Provides password reset completion functionality including:
 * - New password validation with confirmation matching
 * - Password visibility toggle for user convenience
 * - Secure token handling via Supabase Auth
 * - Success state with automatic redirect to login
 * - Error handling for expired or invalid tokens
 */
export function ResetPasswordForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isResetComplete, setIsResetComplete] = useState(false)
  const { updatePassword } = useAuth()
  const router = useRouter()

  /**
   * Initialize React Hook Form with new password validation schema.
   * 
   * Includes password confirmation validation to prevent user input errors
   * and ensure password is entered correctly.
   */
  const form = useForm<NewPasswordFormData>({
    resolver: zodResolver(newPasswordSchema),
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
    mode: 'onBlur',
  })

  /**
   * Handle password reset form submission.
   * 
   * Updates user password using the secure token from the email link.
   * The token is automatically handled by Supabase Auth from URL parameters.
   * Shows success state and redirects to login page after completion.
   * 
   * @param data - Validated form data with new password and confirmation
   */
  const onSubmit = async (data: NewPasswordFormData) => {
    try {
      setIsLoading(true)

      // Show loading toast for immediate feedback
      const loadingToast = toast.loading('Updating password...', {
        description: 'Please wait while we update your password',
      })

      // Update password using secure token from URL
      const result = await updatePassword(data)

      // Dismiss loading toast
      toast.dismiss(loadingToast)

      if (result.error) {
        // Handle specific error cases for better user experience
        if (result.error.includes('expired') || result.error.includes('invalid')) {
          toast.error('Reset link expired', {
            description: 'This password reset link has expired. Please request a new one.',
            duration: 8000,
          })
        } else {
          toast.error('Password update failed', {
            description: result.error,
            duration: 6000,
          })
        }
        return
      }

      // Success - show completion state
      setIsResetComplete(true)
      
      // Show success toast
      toast.success('Password updated successfully!', {
        description: 'You can now sign in with your new password',
        duration: 5000,
      })

      // Redirect to login after brief delay
      setTimeout(() => {
        router.push('/auth/login')
      }, 2000)

    } catch (error) {
      console.error('Reset password form error:', error)
      
      // Show generic error toast for unexpected errors
      toast.error('Something went wrong', {
        description: 'An unexpected error occurred while updating your password. Please try again.',
        duration: 6000,
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Show success state after password is updated
  if (isResetComplete) {
    return (
      <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
        <div className="w-full max-w-sm">
          <Card>
            <CardHeader className="text-center">
              <CardTitle className="text-xl font-semibold text-green-600">
                Password updated!
              </CardTitle>
              <CardDescription>
                Your password has been successfully changed
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="rounded-lg bg-green-50 p-4 text-sm text-green-800 dark:bg-green-950 dark:text-green-200">
                <p className="font-medium mb-1">All set!</p>
                <p>
                  Your password has been updated. You can now sign in to your account 
                  using your new password.
                </p>
              </div>

              <Button 
                className="w-full" 
                onClick={() => router.push('/auth/login')}
              >
                Continue to login
              </Button>
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
              Set new password
            </CardTitle>
            <CardDescription>
              Enter your new password below. Make sure it&apos;s strong and secure.
            </CardDescription>
          </CardHeader>

          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                {/* New Password Field */}
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>New Password</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input 
                            {...field}
                            type={showPassword ? 'text' : 'password'}
                            placeholder="Enter your new password"
                            disabled={isLoading}
                            autoComplete="new-password"
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                            onClick={() => setShowPassword(!showPassword)}
                            disabled={isLoading}
                          >
                            {showPassword ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Confirm New Password Field */}
                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirm New Password</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input 
                            {...field}
                            type={showConfirmPassword ? 'text' : 'password'}
                            placeholder="Confirm your new password"
                            disabled={isLoading}
                            autoComplete="new-password"
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            disabled={isLoading}
                          >
                            {showConfirmPassword ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Password Requirements */}
                <div className="rounded-lg bg-muted p-3 text-xs text-muted-foreground">
                  <p className="font-medium mb-1">Password requirements:</p>
                  <ul className="list-disc list-inside space-y-0.5">
                    <li>At least 6 characters long</li>
                    <li>Mix of uppercase and lowercase letters recommended</li>
                    <li>Include numbers and special characters for better security</li>
                  </ul>
                </div>

                {/* Submit Button */}
                <Button 
                  type="submit" 
                  className="w-full" 
                  disabled={isLoading}
                >
                  {isLoading ? 'Updating password...' : 'Update password'}
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