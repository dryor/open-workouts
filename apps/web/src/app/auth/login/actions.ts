'use server'

import { redirect } from 'next/navigation'
import { container, TYPES } from '@/lib/auth/container'
import type { IAuthService } from '@/lib/auth/interfaces/IAuthService'
import { loginSchema } from '@/lib/validations/auth'

export async function loginAction(formData: FormData) {
  const validatedFields = loginSchema.safeParse({
    email: formData.get('email'),
    password: formData.get('password'),
  })

  if (!validatedFields.success) {
    return { error: 'Invalid form data' }
  }

  let authResult
  try {
    const authService = container.get<IAuthService>(TYPES.IAuthService)
    authResult = await authService.signIn(validatedFields.data)
  } catch (error) {
    return { error: 'Authentication failed' }
  }

  if (authResult.error) {
    return { error: authResult.error.message }
  }

  // Redirect OUTSIDE try-catch block (official Next.js recommendation)
  redirect('/dashboard')
}