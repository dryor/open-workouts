import type { User, Session, AuthResult } from '@/lib/types/auth'

export interface ISessionManager {
  getCurrentUser(): Promise<User | null>
  
  getSession(): Promise<Session | null>
  
  refreshSession(): Promise<AuthResult<Session>>
  
  setSession(session: Session): Promise<void>
  
  clearSession(): Promise<void>
}