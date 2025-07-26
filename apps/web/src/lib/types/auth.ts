export interface User {
  id: string
  email: string
  email_confirmed_at?: string
  created_at: string
  updated_at: string
}

export interface Session {
  access_token: string
  refresh_token: string
  expires_in: number
  expires_at: number
  user: User
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterCredentials {
  email: string
  password: string
}

export interface AuthError {
  message: string
  code?: string
}

export interface AuthResult<T = unknown> {
  data?: T
  error?: AuthError
}