/**
 * Authentication form validation schemas using Zod.
 * 
 * These schemas provide type-safe validation for all authentication forms,
 * following the Philosophy of Software Design principle of making errors
 * impossible rather than detecting them after they occur.
 * 
 * @see https://github.com/colinhacks/zod
 */

import { z } from 'zod'

/**
 * Base email validation schema with comprehensive format checking.
 * 
 * Validates email format and provides user-friendly error messages.
 * Used across all authentication forms requiring email input.
 */
const emailSchema = z
  .string()
  .min(1, 'Email is required')
  .email('Please enter a valid email address')
  .toLowerCase()
  .trim()

/**
 * Base password validation schema with security requirements.
 * 
 * Enforces minimum password security standards while remaining
 * user-friendly. Requirements can be adjusted based on security policy.
 */
const passwordSchema = z
  .string()
  .min(6, 'Password must be at least 6 characters long')
  .max(128, 'Password must be less than 128 characters')

/**
 * Login form validation schema.
 * 
 * Simple email/password validation for user authentication.
 * Minimal validation to avoid blocking legitimate login attempts.
 */
export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'Password is required'),
})

/**
 * Registration form validation schema with password confirmation.
 * 
 * Extends login validation with password confirmation matching.
 * Uses Zod's refine method to ensure passwords match exactly.
 */
export const registerSchema = z
  .object({
    email: emailSchema,
    password: passwordSchema,
    confirmPassword: z.string().min(1, 'Please confirm your password'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'], // Show error on confirmPassword field
  })

/**
 * Password reset request validation schema.
 * 
 * Simple email validation for initiating password reset flow.
 * Only requires valid email address to send reset link.
 */
export const passwordResetSchema = z.object({
  email: emailSchema,
})

/**
 * New password validation schema for password reset completion.
 * 
 * Used when user follows reset link from email to set new password.
 * Includes confirmation matching to prevent user input errors.
 */
export const newPasswordSchema = z
  .object({
    password: passwordSchema,
    confirmPassword: z.string().min(1, 'Please confirm your new password'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  })

// Type exports for TypeScript integration
export type LoginFormData = z.infer<typeof loginSchema>
export type RegisterFormData = z.infer<typeof registerSchema>
export type PasswordResetFormData = z.infer<typeof passwordResetSchema>
export type NewPasswordFormData = z.infer<typeof newPasswordSchema>

/**
 * Custom validation helpers for complex scenarios.
 */
export const validationHelpers = {
  /**
   * Validates password strength and returns strength score.
   * 
   * Provides additional password validation beyond minimum requirements.
   * Can be used to show password strength indicator to users.
   * 
   * @param password - Password to validate
   * @returns Strength score from 0-4 and feedback array
   */
  getPasswordStrength: (password: string) => {
    let score = 0
    const feedback: string[] = []

    if (password.length >= 8) {
      score++
    } else {
      feedback.push('Use at least 8 characters')
    }

    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) {
      score++
    } else {
      feedback.push('Include both uppercase and lowercase letters')
    }

    if (/\d/.test(password)) {
      score++
    } else {
      feedback.push('Include at least one number')
    }

    if (/[^a-zA-Z0-9]/.test(password)) {
      score++
    } else {
      feedback.push('Include at least one special character')
    }

    return { score, feedback }
  },

  /**
   * Validates if email domain is from a disposable email provider.
   * 
   * Helps prevent abuse from temporary email services.
   * Can be extended with more comprehensive domain checking.
   * 
   * @param email - Email address to check
   * @returns True if email appears to be from disposable provider
   */
  isDisposableEmail: (email: string): boolean => {
    const disposableDomains = [
      '10minutemail.com',
      'tempmail.org',
      'guerrillamail.com',
      'mailinator.com',
      // Add more disposable domains as needed
    ]

    const domain = email.split('@')[1]?.toLowerCase()
    return disposableDomains.includes(domain)
  },
}