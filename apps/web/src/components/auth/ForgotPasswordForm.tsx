'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { forgotPasswordSchema, type ForgotPasswordFormData } from '@/lib/validations/auth'
import { forgotPasswordAction } from '@/app/auth/forgot-password/actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
import { Mail } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'

export function ForgotPasswordForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
  })

  const onSubmit = async (data: ForgotPasswordFormData) => {
    setIsLoading(true)
    
    const formData = new FormData()
    formData.append('email', data.email)
    
    const result = await forgotPasswordAction(formData)
    
    if (result?.error) {
      toast.error(result.error)
      setIsLoading(false)
    } else {
      setIsSuccess(true)
      toast.success('Password reset email sent!')
      setIsLoading(false)
    }
  }

  if (isSuccess) {
    return (
      <div className="text-center space-y-4">
        <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
          <Mail className="w-6 h-6 text-primary" />
        </div>
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">
            We&apos;ve sent a password reset link to your email address.
          </p>
          <p className="text-xs text-muted-foreground">
            Check your email and follow the instructions to reset your password.
          </p>
        </div>
        <Link href="/auth/login">
          <Button variant="outline" className="w-full cursor-pointer">
            Back to Sign In
          </Button>
        </Link>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          placeholder="you@example.com"
          {...register('email')}
        />
        {errors.email && (
          <p className="text-sm text-destructive">{errors.email.message}</p>
        )}
      </div>

      <Button type="submit" className="w-full gap-2 cursor-pointer" disabled={isLoading}>
        {isLoading ? (
          <>Sending...</>
        ) : (
          <>
            <Mail className="w-4 h-4" />
            Send Reset Link
          </>
        )}
      </Button>

      <div className="text-center">
        <Link
          href="/auth/login"
          className="text-sm text-muted-foreground hover:text-foreground underline"
        >
          Back to sign in
        </Link>
      </div>
    </form>
  )
}