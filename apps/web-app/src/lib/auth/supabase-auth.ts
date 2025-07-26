/**
 * Supabase authentication service implementation.
 * 
 * This service provides a concrete implementation of the IAuthService interface
 * using Supabase Auth. It follows the "deep module" design principle by hiding
 * complex authentication logic behind a simple, consistent API.
 * 
 * @see https://supabase.com/docs/guides/auth
 * @version Supabase SDK 2.52.1
 */

import { AuthError, User, Session } from '@supabase/supabase-js'
import { createClient } from './client'
import {
  IAuthService,
  ISessionManager,
  LoginCredentials,
  RegisterCredentials,
  PasswordResetRequest,
  NewPasswordData,
  AuthResult,
} from '@/types/auth'

/**
 * Supabase implementation of authentication service.
 * 
 * This class encapsulates all Supabase-specific authentication logic,
 * providing a clean interface that abstracts implementation details.
 * Error handling is centralized and consistent across all operations.
 */
export class SupabaseAuthService implements IAuthService {
  private supabase = createClient()

  /**
   * Authenticates user credentials and establishes authenticated session.
   * 
   * Handles complete login flow including email verification check,
   * session establishment, and comprehensive error handling for all
   * authentication failure scenarios.
   */
  async signIn(credentials: LoginCredentials): Promise<AuthResult> {
    try {
      const { data, error } = await this.supabase.auth.signInWithPassword({
        email: credentials.email,
        password: credentials.password,
      })

      // Handle authentication errors with user-friendly messages
      if (error) {
        // Map Supabase error codes to user-friendly messages
        const errorMessage = this.mapAuthError(error)
        return {
          user: null,
          session: null,
          error: new Error(errorMessage) as AuthError,
        }
      }

      return {
        user: data.user,
        session: data.session,
        error: null,
      }
    } catch (error) {
      return {
        user: null,
        session: null,
        error: error as AuthError,
      }
    }
  }

  /**
   * Creates new user account with email verification requirement.
   * 
   * Registers user in Supabase Auth system and automatically sends
   * verification email. User cannot sign in until email is verified.
   */
  async signUp(credentials: RegisterCredentials): Promise<AuthResult> {
    try {
      // Validate password confirmation on client side
      if (credentials.password !== credentials.confirmPassword) {
        return {
          user: null,
          session: null,
          error: new Error('Passwords do not match') as AuthError,
        }
      }

      const { data, error } = await this.supabase.auth.signUp({
        email: credentials.email,
        password: credentials.password,
        options: {
          // Configure email verification
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      })

      if (error) {
        const errorMessage = this.mapAuthError(error)
        return {
          user: null,
          session: null,
          error: new Error(errorMessage) as AuthError,
        }
      }

      return {
        user: data.user,
        session: data.session,
        error: null,
      }
    } catch (error) {
      return {
        user: null,
        session: null,
        error: error as AuthError,
      }
    }
  }

  /**
   * Terminates current user session and clears all authentication state.
   * 
   * Performs complete logout including Supabase session cleanup and
   * local storage clearing. Safe to call multiple times.
   */
  async signOut(): Promise<void> {
    try {
      const { error } = await this.supabase.auth.signOut()
      
      if (error) {
        // Log error but don't throw - logout should always succeed from UI perspective
        console.error('Logout error:', error)
      }
    } catch (error) {
      // Log error but don't throw - logout should always succeed from UI perspective
      console.error('Logout error:', error)
    }
  }

  /**
   * Initiates password reset flow by sending secure reset email.
   * 
   * Triggers Supabase password reset email containing time-limited
   * secure reset link. User must follow link to complete password change.
   */
  async resetPassword(request: PasswordResetRequest): Promise<{ error: AuthError | null }> {
    try {
      const { error } = await this.supabase.auth.resetPasswordForEmail(request.email, {
        redirectTo: `${window.location.origin}/auth/reset-password`,
      })

      if (error) {
        const errorMessage = this.mapAuthError(error)
        return { error: new Error(errorMessage) as AuthError }
      }

      return { error: null }
    } catch (error) {
      return { error: error as AuthError }
    }
  }

  /**
   * Completes password reset using secure token from email link.
   * 
   * Updates user password in Supabase using secure reset token that
   * is automatically extracted from URL parameters by Supabase client.
   */
  async updatePassword(newPassword: NewPasswordData): Promise<AuthResult> {
    try {
      // Validate password confirmation
      if (newPassword.password !== newPassword.confirmPassword) {
        return {
          user: null,
          session: null,
          error: new Error('Passwords do not match') as AuthError,
        }
      }

      const { data, error } = await this.supabase.auth.updateUser({
        password: newPassword.password,
      })

      if (error) {
        const errorMessage = this.mapAuthError(error)
        return {
          user: null,
          session: null,
          error: new Error(errorMessage) as AuthError,
        }
      }

      return {
        user: data.user,
        session: null, // Session will be updated automatically
        error: null,
      }
    } catch (error) {
      return {
        user: null,
        session: null,
        error: error as AuthError,
      }
    }
  }

  /**
   * Maps Supabase error codes to user-friendly error messages.
   * 
   * Provides consistent error messaging across the application by
   * translating internal Supabase errors to readable messages.
   */
  private mapAuthError(error: AuthError): string {
    switch (error.message) {
      case 'Invalid login credentials':
        return 'Invalid email or password. Please check your credentials and try again.'
      case 'Email not confirmed':
        return 'Please verify your email before signing in. Check your inbox for a verification link.'
      case 'User already registered':
        return 'An account with this email already exists. Please sign in instead.'
      case 'Password should be at least 6 characters':
        return 'Password must be at least 6 characters long.'
      case 'Unable to validate email address: invalid format':
        return 'Please enter a valid email address.'
      case 'Signup is disabled':
        return 'Account registration is currently disabled. Please contact support.'
      default:
        // Log unknown errors for debugging while showing generic message to user
        console.error('Unknown auth error:', error)
        return 'An unexpected error occurred. Please try again or contact support.'
    }
  }
}

/**
 * Supabase implementation of session management.
 * 
 * Provides session validation and user state management using Supabase Auth.
 * Handles automatic session refresh and authentication state changes.
 */
export class SupabaseSessionManager implements ISessionManager {
  private supabase = createClient()

  /**
   * Retrieves current authenticated user session with automatic refresh.
   * 
   * Returns current session if user is authenticated and session is valid.
   * Automatically handles session refresh if token is near expiration.
   */
  async getCurrentSession(): Promise<Session | null> {
    try {
      const { data: { session }, error } = await this.supabase.auth.getSession()
      
      if (error) {
        console.error('Session retrieval error:', error)
        return null
      }

      return session
    } catch (error) {
      console.error('Session retrieval error:', error)
      return null
    }
  }

  /**
   * Gets current authenticated user information.
   * 
   * Returns user profile data if authenticated and session is valid.
   * Provides consistent user object across application components.
   */
  async getCurrentUser(): Promise<User | null> {
    try {
      // First check if we have a session
      const session = await this.getCurrentSession()
      if (!session) {
        return null
      }

      const { data: { user }, error } = await this.supabase.auth.getUser()
      
      if (error) {
        console.error('User retrieval error:', error)
        return null
      }

      return user
    } catch (error) {
      console.error('User retrieval error:', error)
      return null
    }
  }

  /**
   * Validates current session and returns authentication status.
   * 
   * Checks if user has valid, non-expired session. Used by middleware
   * and route guards to determine if user can access protected content.
   */
  async isAuthenticated(): Promise<boolean> {
    const session = await this.getCurrentSession()
    return session !== null && !this.isSessionExpired(session)
  }

  /**
   * Subscribes to authentication state changes.
   * 
   * Listens for Supabase auth events (login, logout, token refresh)
   * and calls provided callback with updated authentication state.
   */
  onAuthStateChange(callback: (session: Session | null) => void): () => void {
    const { data: { subscription } } = this.supabase.auth.onAuthStateChange(
      (event, session) => {
        // Log auth events for debugging
        console.log('Auth state change:', event, session?.user?.email || 'no user')
        callback(session)
      }
    )

    // Return unsubscribe function
    return () => {
      subscription.unsubscribe()
    }
  }

  /**
   * Checks if session is expired based on expiration timestamp.
   * 
   * Helper method to validate session freshness before using it
   * for authenticated operations.
   */
  private isSessionExpired(session: Session): boolean {
    if (!session.expires_at) return false
    
    // Add 5 minute buffer before actual expiration
    const expirationBuffer = 5 * 60 * 1000 // 5 minutes in milliseconds
    const expirationTime = session.expires_at * 1000 - expirationBuffer
    
    return Date.now() >= expirationTime
  }
}

// Export singleton instances for application use
export const authService = new SupabaseAuthService()
export const sessionManager = new SupabaseSessionManager()