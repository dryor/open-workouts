/**
 * Authentication type definitions following Philosophy of Software Design principles.
 * 
 * These interfaces define the contracts for authentication services, providing
 * simple and general-purpose APIs that hide implementation complexity.
 * 
 * @see https://supabase.com/docs/reference/javascript/typescript-support
 */

import { User, Session, AuthError } from '@supabase/supabase-js'

/**  
 * User credentials for authentication operations.
 * Provides a simple interface for login/registration without exposing internal details.
 */
export interface LoginCredentials {
  email: string
  password: string
}

/**
 * Registration data including confirmation password.
 * Extends login credentials with additional validation requirements.
 */
export interface RegisterCredentials extends LoginCredentials {
  confirmPassword: string
}

/**
 * Password reset request containing user email.
 * Simple interface for initiating password recovery flow.
 */
export interface PasswordResetRequest {
  email: string
}

/**
 * New password data for password reset completion.
 * Used when user follows reset link from email.
 */
export interface NewPasswordData {
  password: string
  confirmPassword: string
}

/**
 * Authentication result containing user session or error.
 * Provides unified response format for all auth operations.
 */
export interface AuthResult {
  user: User | null
  session: Session | null
  error: AuthError | null
}

/**
 * Authentication service interface defining all auth operations.
 * 
 * This interface follows the "deep module" principle - provides powerful
 * functionality (complete auth system) through a simple interface.
 * Implementation details are hidden from consumers.
 */
export interface IAuthService {
  /**
   * Authenticates user credentials against Supabase and establishes session.
   * 
   * This method handles the complete login flow including credential validation,
   * session creation, and error handling for various failure scenarios.
   * 
   * @param credentials - User email and password
   * @returns Promise resolving to authenticated user session
   * @throws AuthError when credentials are invalid or user is unverified
   * @throws NetworkError when Supabase service is unavailable
   */
  signIn(credentials: LoginCredentials): Promise<AuthResult>

  /**
   * Creates new user account with email verification requirement.
   * 
   * Registers user in Supabase Auth system and triggers email verification.
   * User must verify email before they can successfully sign in.
   * 
   * @param credentials - Registration data with password confirmation
   * @returns Promise resolving to pending user account (unverified)
   * @throws AuthError when email is already registered or validation fails
   */
  signUp(credentials: RegisterCredentials): Promise<AuthResult>

  /**
   * Terminates current user session and clears authentication state.
   * 
   * Performs complete logout including Supabase session cleanup and
   * local state clearing. Safe to call multiple times.
   * 
   * @returns Promise resolving when logout is complete
   */
  signOut(): Promise<void>

  /**
   * Initiates password reset flow by sending reset email to user.
   * 
   * Triggers Supabase password reset email containing secure reset link.
   * User must follow link to complete password change process.
   * 
   * @param request - Email address for password reset
   * @returns Promise resolving when reset email is sent
   * @throws AuthError when email is not found in system
   */
  resetPassword(request: PasswordResetRequest): Promise<{ error: AuthError | null }>

  /**
   * Completes password reset using token from email link.
   * 
   * Updates user password in Supabase using secure reset token.
   * Token is automatically extracted from URL parameters.
   * 
   * @param newPassword - New password data with confirmation
   * @returns Promise resolving to updated user session
   * @throws AuthError when token is invalid or expired
   */
  updatePassword(newPassword: NewPasswordData): Promise<AuthResult>
}

/**
 * Session management interface for authentication state.
 * 
 * Provides simple API for session validation and user state management.
 * Abstracts Supabase session complexity behind clean interface.
 */
export interface ISessionManager {
  /**
   * Retrieves current authenticated user session.
   * 
   * Returns current session if user is authenticated, null otherwise.
   * Automatically handles session refresh and validation.
   * 
   * @returns Promise resolving to current session or null
   */
  getCurrentSession(): Promise<Session | null>

  /**
   * Gets current authenticated user information.
   * 
   * Returns user profile data if authenticated, null otherwise.
   * Provides consistent user object across application.
   * 
   * @returns Promise resolving to current user or null
   */
  getCurrentUser(): Promise<User | null>

  /**
   * Validates current session and returns authentication status.
   * 
   * Checks if user has valid, non-expired session. Used by middleware
   * and route guards to protect authenticated routes.
   * 
   * @returns Promise resolving to true if session is valid
   */
  isAuthenticated(): Promise<boolean>

  /**
   * Listens for authentication state changes.
   * 
   * Subscribes to Supabase auth events (login, logout, token refresh).
   * Callback receives updated auth state for UI updates.
   * 
   * @param callback - Function called when auth state changes
   * @returns Unsubscribe function to stop listening
   */
  onAuthStateChange(callback: (session: Session | null) => void): () => void
}