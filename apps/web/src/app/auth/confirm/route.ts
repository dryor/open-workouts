import { type EmailOtpType } from '@supabase/supabase-js'
import { NextRequest } from 'next/server'
import { redirect } from 'next/navigation'
import { createSupabaseServerClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const token_hash = searchParams.get('token_hash')
  const type = searchParams.get('type') as EmailOtpType | null
  const next = searchParams.get('next') ?? '/'

  if (!token_hash || !type) {
    redirect('/auth/login?error=Invalid confirmation link')
  }

  const supabase = await createSupabaseServerClient()
  
  const { error } = await supabase.auth.verifyOtp({
    type,
    token_hash,
  })

  if (error) {
    redirect('/auth/login?error=Failed to verify token')
  }

  // Redirect based on token type
  if (type === 'email') {
    // Email confirmation - redirect to dashboard
    redirect('/dashboard?message=Email verified successfully')
  } else if (type === 'recovery') {
    // Password reset - redirect to reset password page
    redirect('/auth/reset-password?verified=true')
  } else {
    // Other types - redirect to next parameter or default
    redirect(next)
  }
}