import { AuthLayout } from '@/components/auth/AuthLayout'
import { ResetPasswordForm } from '@/components/auth/ResetPasswordForm'

export default async function ResetPasswordPage() {
  return (
    <AuthLayout
      title="Reset your password"
      description="Enter your new password below"
    >
      <ResetPasswordForm />
    </AuthLayout>
  )
}