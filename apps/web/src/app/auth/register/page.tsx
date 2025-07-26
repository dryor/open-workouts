import { redirect } from 'next/navigation'
import { container, TYPES } from '@/lib/auth/container'
import type { ISessionManager } from '@/lib/auth/interfaces/ISessionManager'
import { AuthLayout } from '@/components/auth/AuthLayout'
import { RegisterForm } from '@/components/auth/RegisterForm'

export default async function RegisterPage() {
  const sessionManager = container.get<ISessionManager>(TYPES.ISessionManager)
  const user = await sessionManager.getCurrentUser()

  if (user) {
    redirect('/dashboard')
  }

  return (
    <AuthLayout
      title="Create your account"
      description="Get started with Open Workouts today"
    >
      <RegisterForm />
    </AuthLayout>
  )
}