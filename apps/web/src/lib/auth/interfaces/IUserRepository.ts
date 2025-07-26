import type { User, AuthResult } from '@/lib/types/auth'

export interface IUserRepository {
  getUserById(id: string): Promise<User | null>
  
  getUserByEmail(email: string): Promise<User | null>
  
  createUserProfile(user: User): Promise<AuthResult<User>>
  
  updateUserProfile(id: string, updates: Partial<User>): Promise<AuthResult<User>>
}