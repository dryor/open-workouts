/**
 * Forgot password page component.
 * 
 * This page provides the password reset initiation interface where users
 * can request a password reset email. It wraps the ForgotPasswordForm
 * component and handles the forgot password page layout.
 * 
 * The page is part of the password recovery flow and works in conjunction
 * with the reset password page to provide complete password recovery.
 */

import type { Metadata } from 'next'
import { ForgotPasswordForm } from '@/components/auth/forgot-password-form'

/**
 * Page metadata for SEO and browser display.
 * 
 * Provides appropriate title and description for the forgot password page
 * to help users understand the password recovery process.
 */
export const metadata: Metadata = {
  title: 'Forgot Password | Open Workouts',
  description: 'Reset your Open Workouts account password. Enter your email address to receive password reset instructions.',
}

/**
 * Forgot password page component.
 * 
 * Simple page wrapper that renders the ForgotPasswordForm component.
 * The form handles email validation, reset request submission, and
 * displays success state with user instructions.
 * 
 * @returns JSX element containing the forgot password interface
 */
export default function ForgotPasswordPage() {
  return <ForgotPasswordForm />
}