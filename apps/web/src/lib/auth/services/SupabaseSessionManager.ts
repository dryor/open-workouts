import { injectable } from 'inversify'
import type { ISessionManager } from '../interfaces/ISessionManager'
import type { User, Session, AuthResult } from '@/lib/types/auth'
import { createSupabaseServerClient } from '@/lib/supabase/server'

@injectable()
export class SupabaseSessionManager implements ISessionManager {
  async getCurrentUser(): Promise<User | null> {
    try {
      const supabase = await createSupabaseServerClient()
      
      const { data: { user }, error } = await supabase.auth.getUser()

      if (error || !user) {
        return null
      }

      return user as User
    } catch (error) {
      return null
    }
  }

  async getSession(): Promise<Session | null> {
    try {
      const supabase = await createSupabaseServerClient()
      
      const { data: { session }, error } = await supabase.auth.getSession()

      if (error || !session) {
        return null
      }

      return session as Session
    } catch (error) {
      return null
    }
  }

  async refreshSession(): Promise<AuthResult<Session>> {
    try {
      const supabase = await createSupabaseServerClient()
      
      const { data, error } = await supabase.auth.refreshSession()

      if (error) {
        return { error: { message: error.message, code: error.name } }
      }

      if (!data.session) {
        return { error: { message: 'Failed to refresh session' } }
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

  async setSession(session: Session): Promise<void> {
    try {
      const supabase = await createSupabaseServerClient()
      
      await supabase.auth.setSession({
        access_token: session.access_token,
        refresh_token: session.refresh_token,
      })
    } catch (error) {
      console.error('Failed to set session:', error)
    }
  }

  async clearSession(): Promise<void> {
    try {
      const supabase = await createSupabaseServerClient()
      
      await supabase.auth.signOut()
    } catch (error) {
      console.error('Failed to clear session:', error)
    }
  }
}