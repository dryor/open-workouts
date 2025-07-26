/**
 * Registration form component for new user account creation.
 * 
 * This component provides complete user registration functionality with
 * email/password signup, password confirmation validation, and email
 * verification workflow using Supabase Auth.
 * 
 * Features comprehensive form validation, loading states, and user feedback
 * through Sonner toast notifications following UX best practices.
 */

'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import Link from 'next/link'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'

import { useAuth } from '@/hooks/use-auth'
import { registerSchema, RegisterFormData } from '@/lib/auth/validation'

/**
 * Registration form component with email verification workflow.
 * 
 * Handles complete user registration including:
 * - Email and password validation with confirmation
 * - Password strength feedback
 * - Email verification notification
 * - Error handling with user-friendly messages
 * - Link to login page for existing users
 */
export function RegisterForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [isRegistered, setIsRegistered] = useState(false)
  const { signUp } = useAuth()

  /**
   * Initialize React Hook Form with registration validation schema.
   * 
   * Includes password confirmation validation and real-time form feedback
   * to guide users through the registration process.
   */
  const form = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: '',
    },
    mode: 'onBlur', // Validate on blur for better UX
  })

  /**
   * Handle registration form submission with comprehensive error handling.
   * 
   * Creates new user account in Supabase, sends verification email, and
   * provides appropriate user feedback. Shows success state with
   * instructions for email verification.
   * 
   * @param data - Validated registration form data
   */
  const onSubmit = async (data: RegisterFormData) => {
    try {
      setIsLoading(true)

      // Show loading toast for immediate user feedback
      const loadingToast = toast.loading('Creating your account...', {
        description: 'Please wait while we set up your account',
      })

      // Attempt user registration with provided credentials
      const result = await signUp(data)

      // Dismiss loading toast
      toast.dismiss(loadingToast)

      if (result.error) {
        // Show error toast with specific error message
        toast.error('Registration failed', {
          description: result.error,
          duration: 6000,
        })
        return
      }

      // Registration successful - show success state
      setIsRegistered(true)
      
      // Show success toast with email verification instructions
      toast.success('Account created successfully!', {
        description: 'Please check your email and click the verification link to activate your account',
        duration: 8000,
      })

    } catch (error) {
      console.error('Registration form error:', error)
      
      // Show generic error toast for unexpected errors
      toast.error('Something went wrong', {
        description: 'An unexpected error occurred during registration. Please try again.',
        duration: 5000,
      })
    } finally {
      setIsLoading(false)
    }
  }

  /**
   * Handle Google OAuth registration.
   * 
   * Placeholder for OAuth implementation. Will be implemented
   * when OAuth providers are configured in Supabase.
   */
  const handleGoogleSignup = () => {
    toast.info('Google signup coming soon', {
      description: 'OAuth integration will be available in the next update',
    })
  }

  // Show success state after successful registration
  if (isRegistered) {
    return (
      <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
        <div className="w-full max-w-sm">
          <Card>
            <CardHeader className="text-center">
              <CardTitle className="text-xl font-semibold text-green-600">
                Check your email
              </CardTitle>
              <CardDescription>
                We&apos;ve sent a verification link to your email address
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="rounded-lg bg-green-50 p-4 text-sm text-green-800 dark:bg-green-950 dark:text-green-200">
                <p className="font-medium mb-1">Almost there!</p>
                <p>
                  Please check your email and click the verification link to activate 
                  your account. You won&apos;t be able to sign in until your email is verified.
                </p>
              </div>

              <div className="text-center text-sm">
                Already have an account?{' '}
                <Link href="/auth/login" className="underline underline-offset-4">
                  Sign in
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
              Create your account
            </CardTitle>
            <CardDescription>
              Enter your information to create a new account
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

                {/* Password Field */}
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input 
                          {...field}
                          type="password"
                          placeholder="Create a strong password"
                          disabled={isLoading}
                          autoComplete="new-password"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Confirm Password Field */}
                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirm Password</FormLabel>
                      <FormControl>
                        <Input 
                          {...field}
                          type="password"
                          placeholder="Confirm your password"
                          disabled={isLoading}
                          autoComplete="new-password"
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
                  {isLoading ? 'Creating account...' : 'Create account'}
                </Button>

                {/* Google Signup Button */}
                <Button 
                  type="button"
                  variant="outline" 
                  className="w-full" 
                  onClick={handleGoogleSignup}
                  disabled={isLoading}
                >
                  Sign up with Google
                </Button>
              </form>
            </Form>

            {/* Login Link */}
            <div className="mt-4 text-center text-sm">
              Already have an account?{' '}
              <Link href="/auth/login" className="underline underline-offset-4">
                Sign in
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}