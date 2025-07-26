'use server'

import { container, TYPES } from '@/lib/auth/container'
import type { IAuthService } from '@/lib/auth/interfaces/IAuthService'
import { forgotPasswordSchema } from '@/lib/validations/auth'

export async function forgotPasswordAction(formData: FormData) {
  const validatedFields = forgotPasswordSchema.safeParse({
    email: formData.get('email'),
  })

  if (!validatedFields.success) {
    return { error: 'Invalid email address' }
  }

  const authService = container.get<IAuthService>(TYPES.IAuthService)
  const result = await authService.requestPasswordReset(validatedFields.data.email)

  if (result.error) {
    return { error: result.error.message }
  }

  return { success: 'Password reset email sent' }
}