'use server'

import { redirect } from 'next/navigation'
import { container, TYPES } from '@/lib/auth/container'
import type { IAuthService } from '@/lib/auth/interfaces/IAuthService'
import { resetPasswordSchema } from '@/lib/validations/auth'

export async function resetPasswordAction(formData: FormData) {
  const validatedFields = resetPasswordSchema.safeParse({
    password: formData.get('password'),
    confirmPassword: formData.get('confirmPassword'),
  })

  if (!validatedFields.success) {
    return { error: 'Invalid password data' }
  }

  let authResult
  try {
    const authService = container.get<IAuthService>(TYPES.IAuthService)
    authResult = await authService.updatePassword(validatedFields.data.password)
  } catch (error) {
    return { error: 'Password update failed' }
  }

  if (authResult.error) {
    return { error: authResult.error.message }
  }

  // Redirect OUTSIDE try-catch block (official Next.js recommendation)
  redirect('/auth/login?message=Password updated successfully')
}