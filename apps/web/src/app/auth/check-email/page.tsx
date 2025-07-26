import { AuthLayout } from '@/components/auth/AuthLayout'
import { Mail } from 'lucide-react'
import Link from 'next/link'

export default function CheckEmailPage() {
  return (
    <AuthLayout
      title="Check your email"
      description="We've sent you a verification link"
    >
      <div className="text-center space-y-4">
        <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
          <Mail className="w-6 h-6 text-primary" />
        </div>
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">
            Please check your email and click the verification link to activate your account.
          </p>
          <p className="text-xs text-muted-foreground">
            Didn&apos;t receive the email? Check your spam folder or{' '}
            <Link href="/auth/register" className="text-foreground hover:underline">
              try again
            </Link>
          </p>
        </div>
      </div>
    </AuthLayout>
  )
}