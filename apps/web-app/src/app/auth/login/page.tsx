/**
 * Login page component.
 * 
 * This page provides the login interface for user authentication.
 * It wraps the LoginForm component and handles the login page layout
 * following Next.js App Router conventions.
 * 
 * The page is excluded from authentication middleware since it's part
 * of the auth flow. Authenticated users are redirected to dashboard
 * by the middleware automatically.
 */

import type { Metadata } from 'next'
import { LoginForm } from '@/components/auth/login-form'

/**
 * Page metadata for SEO and browser display.
 * 
 * Provides appropriate title and description for the login page
 * to improve search engine optimization and user experience.
 */
export const metadata: Metadata = {
  title: 'Sign In | Open Workouts',
  description: 'Sign in to your Open Workouts account to track your fitness progress and access your workout data.',
}

/**
 * Login page component.
 * 
 * Simple page wrapper that renders the LoginForm component.
 * The form handles all authentication logic, validation, and user feedback.
 * 
 * @returns JSX element containing the login interface
 */
export default function LoginPage() {
  return <LoginForm />
}