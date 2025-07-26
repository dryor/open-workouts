import { redirect } from 'next/navigation'
import { container, TYPES } from '@/lib/auth/container'
import type { ISessionManager } from '@/lib/auth/interfaces/ISessionManager'
import { AuthLayout } from '@/components/auth/AuthLayout'
import { LoginForm } from '@/components/auth/LoginForm'

export default async function LoginPage() {
  const sessionManager = container.get<ISessionManager>(TYPES.ISessionManager)
  const user = await sessionManager.getCurrentUser()

  if (user) {
    redirect('/dashboard')
  }

  return (
    <AuthLayout
      title="Welcome back"
      description="Sign in to your account to continue"
    >
      <LoginForm />
    </AuthLayout>
  )
}