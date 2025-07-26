/**
 * Registration page component.
 * 
 * This page provides the user registration interface for creating new accounts.
 * It wraps the RegisterForm component and handles the registration page layout
 * following Next.js App Router conventions.
 * 
 * The page includes email verification workflow and redirects authenticated
 * users to the dashboard automatically via middleware.
 */

import type { Metadata } from 'next'
import { RegisterForm } from '@/components/auth/register-form'

/**
 * Page metadata for SEO and browser display.
 * 
 * Provides appropriate title and description for the registration page
 * to improve search engine optimization and encourage user signups.
 */
export const metadata: Metadata = {
  title: 'Create Account | Open Workouts',
  description: 'Create your free Open Workouts account to start tracking your fitness journey and monitor your workout progress.',
}

/**
 * Registration page component.
 * 
 * Simple page wrapper that renders the RegisterForm component.
 * The form handles all registration logic, validation, email verification,
 * and user feedback through toast notifications.
 * 
 * @returns JSX element containing the registration interface
 */
export default function RegisterPage() {
  return <RegisterForm />
}