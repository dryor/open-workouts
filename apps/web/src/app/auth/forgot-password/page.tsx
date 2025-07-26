import { redirect } from 'next/navigation'
import { container, TYPES } from '@/lib/auth/container'
import type { ISessionManager } from '@/lib/auth/interfaces/ISessionManager'
import { AuthLayout } from '@/components/auth/AuthLayout'
import { ForgotPasswordForm } from '@/components/auth/ForgotPasswordForm'

export default async function ForgotPasswordPage() {
  const sessionManager = container.get<ISessionManager>(TYPES.ISessionManager)
  const user = await sessionManager.getCurrentUser()

  if (user) {
    redirect('/dashboard')
  }

  return (
    <AuthLayout
      title="Forgot your password?"
      description="Enter your email and we'll send you a reset link"
    >
      <ForgotPasswordForm />
    </AuthLayout>
  )
}