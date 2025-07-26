import { injectable } from 'inversify'
import type { IAuthService } from '../interfaces/IAuthService'
import type { LoginCredentials, RegisterCredentials, AuthResult, Session, User } from '@/lib/types/auth'
import { createSupabaseServerClient } from '@/lib/supabase/server'

@injectable()
export class SupabaseAuthService implements IAuthService {
  async signUp(credentials: RegisterCredentials): Promise<AuthResult<User>> {
    try {
      const supabase = await createSupabaseServerClient()
      
      const { data, error } = await supabase.auth.signUp({
        email: credentials.email,
        password: credentials.password,
        options: {
          emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/confirm`,
        },
      })

      if (error) {
        return { error: { message: error.message, code: error.name } }
      }

      if (!data.user) {
        return { error: { message: 'Failed to create user' } }
      }

      return { data: data.user as User }
    } catch (error) {
      return { 
        error: { 
          message: error instanceof Error ? error.message : 'Unknown error occurred' 
        } 
      }
    }
  }

  async signIn(credentials: LoginCredentials): Promise<AuthResult<Session>> {
    try {
      const supabase = await createSupabaseServerClient()
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email: credentials.email,
        password: credentials.password,
      })

      if (error) {
        return { error: { message: error.message, code: error.name } }
      }

      if (!data.session) {
        return { error: { message: 'Failed to create session' } }
      }

      return { data: data.session as Session }
    } catch (error) {
      return { 
        error: { 
          message: error instanceof Error ? error.message : 'Unknown error occurred' 
        } 
      }
    }
  }

  async signOut(): Promise<AuthResult<void>> {
    try {
      const supabase = await createSupabaseServerClient()
      
      const { error } = await supabase.auth.signOut()

      if (error) {
        return { error: { message: error.message, code: error.name } }
      }

      return { data: undefined }
    } catch (error) {
      return { 
        error: { 
          message: error instanceof Error ? error.message : 'Unknown error occurred' 
        } 
      }
    }
  }

  async verifyEmailToken(tokenHash: string): Promise<AuthResult<Session>> {
    try {
      const supabase = await createSupabaseServerClient()
      
      const { data, error } = await supabase.auth.verifyOtp({
        token_hash: tokenHash,
        type: 'email',
      })

      if (error) {
        return { error: { message: error.message, code: error.name } }
      }

      if (!data.session) {
        return { error: { message: 'Failed to verify email' } }
      }

      return { data: data.session as Session }
    } catch (error) {
      return { 
        error: { 
          message: error instanceof Error ? error.message : 'Unknown error occurred' 
        } 
      }
    }
  }

  async requestPasswordReset(email: string): Promise<AuthResult<void>> {
    try {
      const supabase = await createSupabaseServerClient()
      
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/reset-password`,
      })

      if (error) {
        return { error: { message: error.message, code: error.name } }
      }

      return { data: undefined }
    } catch (error) {
      return { 
        error: { 
          message: error instanceof Error ? error.message : 'Unknown error occurred' 
        } 
      }
    }
  }

  async updatePassword(password: string): Promise<AuthResult<User>> {
    try {
      const supabase = await createSupabaseServerClient()
      
      const { data, error } = await supabase.auth.updateUser({
        password: password,
      })

      if (error) {
        return { error: { message: error.message, code: error.name } }
      }

      if (!data.user) {
        return { error: { message: 'Failed to update password' } }
      }

      return { data: data.user as User }
    } catch (error) {
      return { 
        error: { 
          message: error instanceof Error ? error.message : 'Unknown error occurred' 
        } 
      }
    }
  }
}