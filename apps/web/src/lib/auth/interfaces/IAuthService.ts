import type { LoginCredentials, RegisterCredentials, AuthResult, Session, User } from '@/lib/types/auth'

export interface IAuthService {
  signUp(credentials: RegisterCredentials): Promise<AuthResult<User>>
  
  signIn(credentials: LoginCredentials): Promise<AuthResult<Session>>
  
  signOut(): Promise<AuthResult<void>>
  
  verifyEmailToken(tokenHash: string): Promise<AuthResult<Session>>
  
  requestPasswordReset(email: string): Promise<AuthResult<void>>
  
  updatePassword(password: string): Promise<AuthResult<User>>
}