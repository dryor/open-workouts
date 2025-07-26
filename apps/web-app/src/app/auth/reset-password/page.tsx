/**
 * Reset password page component.
 * 
 * This page provides the password reset completion interface where users
 * can set a new password using the secure token from their email link.
 * It wraps the ResetPasswordForm component and handles the reset page layout.
 * 
 * The page automatically extracts the reset token from URL parameters
 * that Supabase includes when users click the reset link from their email.
 */

import type { Metadata } from 'next'
import { ResetPasswordForm } from '@/components/auth/reset-password-form'

/**
 * Page metadata for SEO and browser display.
 * 
 * Provides appropriate title and description for the reset password page
 * to help users understand they're completing the password recovery process.
 */
export const metadata: Metadata = {
  title: 'Reset Password | Open Workouts',
  description: 'Complete your password reset by setting a new secure password for your Open Workouts account.',
}

/**
 * Reset password page component.
 * 
 * Simple page wrapper that renders the ResetPasswordForm component.
 * The form handles token validation, new password submission, and
 * redirects to login page upon successful completion.
 * 
 * @returns JSX element containing the reset password interface
 */
export default function ResetPasswordPage() {
  return <ResetPasswordForm />
}