/**
 * Login form component based on shadcn/ui login-01 block.
 * 
 * This component provides a complete login interface with email/password
 * authentication, form validation using React Hook Form + Zod, and
 * comprehensive error handling with user feedback via Sonner toasts.
 * 
 * Follows Philosophy of Software Design by providing a simple interface
 * that hides the complexity of form state management and validation.
 * 
 * @see https://ui.shadcn.com/blocks/login-01
 */

'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'

import { useAuth } from '@/hooks/use-auth'
import { loginSchema, LoginFormData } from '@/lib/auth/validation'

/**
 * Login form component with email/password authentication.
 * 
 * Provides complete login functionality including:
 * - Form validation with real-time feedback
 * - Loading states during authentication
 * - Error handling with user-friendly messages
 * - Automatic redirect to dashboard on success
 * - Links to registration and password reset
 */
export function LoginForm() {
  const [isLoading, setIsLoading] = useState(false)
  const { signIn } = useAuth()
  const router = useRouter()

  /**
   * Initialize React Hook Form with Zod validation schema.
   * 
   * Form state is managed automatically with validation errors
   * displayed in real-time as user types.
   */
  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
    mode: 'onBlur', // Validate on blur for better UX
  })

  /**
   * Handle form submission with authentication and error handling.
   * 
   * Manages loading state, calls authentication service, and provides
   * user feedback through toast notifications. Redirects to dashboard
   * on successful authentication.
   * 
   * @param data - Validated form data from React Hook Form
   */
  const onSubmit = async (data: LoginFormData) => {
    try {
      setIsLoading(true)

      // Show loading toast for immediate user feedback
      const loadingToast = toast.loading('Signing in...', {
        description: 'Please wait while we authenticate your credentials',
      })

      // Attempt authentication with provided credentials
      const result = await signIn(data)

      // Dismiss loading toast
      toast.dismiss(loadingToast)

      if (result.error) {
        // Show error toast with specific error message
        toast.error('Authentication failed', {
          description: result.error,
          duration: 5000,
        })
        return
      }

      // Show success toast and redirect to dashboard
      toast.success('Welcome back!', {
        description: 'You have been successfully signed in',
        duration: 3000,
      })

      // Redirect to dashboard after brief delay for toast visibility
      setTimeout(() => {
        router.push('/dashboard')
      }, 1000)

    } catch (error) {
      console.error('Login form error:', error)
      
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
   * Handle Google OAuth login.
   * 
   * Placeholder for OAuth implementation. Will be implemented
   * when OAuth providers are configured in Supabase.
   */
  const handleGoogleLogin = () => {
    toast.info('Google login coming soon', {
      description: 'OAuth integration will be available in the next update',
    })
  }

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-xl font-semibold">
              Login to your account
            </CardTitle>
            <CardDescription>
              Enter your email below to login to your account
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
                      <div className="flex items-center justify-between">
                        <FormLabel>Password</FormLabel>
                        <button
                          type="button"
                          onClick={() => toast.info('Coming soon!', {
                            description: 'Password reset will be available in the next update',
                            duration: 4000,
                          })}
                          className="ml-auto inline-block text-sm underline-offset-4 hover:underline text-foreground"
                        >
                          Forgot your password?
                        </button>
                      </div>
                      <FormControl>
                        <Input 
                          {...field}
                          type="password"
                          disabled={isLoading}
                          autoComplete="current-password"
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
                  {isLoading ? 'Signing in...' : 'Login'}
                </Button>

                {/* Google Login Button */}
                <Button 
                  type="button"
                  variant="outline" 
                  className="w-full" 
                  onClick={handleGoogleLogin}
                  disabled={isLoading}
                >
                  Login with Google
                </Button>
              </form>
            </Form>

            {/* Registration Link */}
            <div className="mt-4 text-center text-sm">
              Don&apos;t have an account?{' '}
              <Link href="/auth/register" className="underline underline-offset-4">
                Sign up
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}