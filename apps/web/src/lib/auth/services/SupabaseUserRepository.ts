import { injectable } from 'inversify'
import type { IUserRepository } from '../interfaces/IUserRepository'
import type { User, AuthResult } from '@/lib/types/auth'
import { createSupabaseServerClient } from '@/lib/supabase/server'

@injectable()
export class SupabaseUserRepository implements IUserRepository {
  async getUserById(id: string): Promise<User | null> {
    try {
      const supabase = await createSupabaseServerClient()
      
      const { data, error } = await supabase.auth.admin.getUserById(id)

      if (error || !data.user) {
        return null
      }

      return data.user as User
    } catch (error) {
      return null
    }
  }

  async getUserByEmail(email: string): Promise<User | null> {
    try {
      const supabase = await createSupabaseServerClient()
      
      const { data, error } = await supabase
        .from('auth.users')
        .select('*')
        .eq('email', email)
        .single()

      if (error || !data) {
        return null
      }

      return data as User
    } catch (error) {
      return null
    }
  }

  async createUserProfile(user: User): Promise<AuthResult<User>> {
    try {
      const supabase = await createSupabaseServerClient()
      
      const { data, error } = await supabase
        .from('profiles')
        .insert({
          id: user.id,
          email: user.email,
          created_at: user.created_at,
          updated_at: user.updated_at,
        })
        .select()
        .single()

      if (error) {
        return { error: { message: error.message, code: error.code } }
      }

      return { data: data as User }
    } catch (error) {
      return { 
        error: { 
          message: error instanceof Error ? error.message : 'Unknown error occurred' 
        } 
      }
    }
  }

  async updateUserProfile(id: string, updates: Partial<User>): Promise<AuthResult<User>> {
    try {
      const supabase = await createSupabaseServerClient()
      
      const { data, error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', id)
        .select()
        .single()

      if (error) {
        return { error: { message: error.message, code: error.code } }
      }

      return { data: data as User }
    } catch (error) {
      return { 
        error: { 
          message: error instanceof Error ? error.message : 'Unknown error occurred' 
        } 
      }
    }
  }
}