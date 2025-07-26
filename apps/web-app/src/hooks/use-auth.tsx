/**
 * Authentication state management hook using Supabase Auth.
 * 
 * This hook provides a simple interface for authentication state management
 * across the application. It follows React best practices and provides
 * consistent auth state regardless of component tree location.
 * 
 * @see https://supabase.com/docs/guides/auth/auth-helpers/nextjs
 */

'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { useRouter } from 'next/navigation'
import { User, Session } from '@supabase/supabase-js'
import { authService, sessionManager } from '@/lib/auth/supabase-auth'
import { LoginCredentials, RegisterCredentials, PasswordResetRequest, NewPasswordData } from '@/types/auth'

/**
 * Authentication context state interface.
 * 
 * Provides all authentication state and operations needed by components.
 * Designed to be simple and intuitive for component consumption.
 */
interface AuthContextType {
  // Current authentication state
  user: User | null
  session: Session | null
  loading: boolean

  // Authentication operations
  signIn: (credentials: LoginCredentials) => Promise<{ error: string | null }>
  signUp: (credentials: RegisterCredentials) => Promise<{ error: string | null }>
  signOut: () => Promise<void>
  resetPassword: (request: PasswordResetRequest) => Promise<{ error: string | null }>
  updatePassword: (newPassword: NewPasswordData) => Promise<{ error: string | null }>

  // Utility functions
  isAuthenticated: boolean
}

/**
 * Authentication context for providing auth state throughout component tree.
 * 
 * Context is created with undefined to force proper provider usage.
 * Components must be wrapped in AuthProvider to access auth state.
 */
const AuthContext = createContext<AuthContextType | undefined>(undefined)

/**
 * Authentication provider component that manages global auth state.
 * 
 * This provider handles all authentication state management including:
 * - Initial session loading and validation
 * - Authentication state changes from Supabase
 * - Centralized loading states during auth operations
 * - Error handling and user feedback
 * 
 * @param children - Child components that need access to auth state
 */
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  /**
   * Initialize authentication state on provider mount.
   * 
   * Retrieves current session and sets up auth state listener.
   * Loading state is managed to prevent UI flicker during initialization.
   */
  useEffect(() => {
    let mounted = true

    // Get initial session
    const getInitialSession = async () => {
      try {
        const currentSession = await sessionManager.getCurrentSession()
        const currentUser = await sessionManager.getCurrentUser()

        if (mounted) {
          setSession(currentSession)
          setUser(currentUser)
          setLoading(false)
        }
      } catch (error) {
        console.error('Error loading initial session:', error)
        if (mounted) {
          setLoading(false)
        }
      }
    }

    getInitialSession()

    // Listen for auth state changes
    const unsubscribe = sessionManager.onAuthStateChange((session) => {
      if (mounted) {
        setSession(session)
        setUser(session?.user ?? null)
        setLoading(false)
      }
    })

    return () => {
      mounted = false
      unsubscribe()
    }
  }, [])

  /**
   * Sign in user with email and password.
   * 
   * Handles authentication with user-friendly error messages.
   * Loading state is managed automatically during the operation.
   * 
   * @param credentials - User email and password
   * @returns Object with error message or null on success
   */
  const signIn = async (credentials: LoginCredentials): Promise<{ error: string | null }> => {
    try {
      setLoading(true)
      const result = await authService.signIn(credentials)

      if (result.error) {
        return { error: result.error.message }
      }

      // State will be updated automatically by auth state change listener
      return { error: null }
    } catch (error) {
      console.error('Sign in error:', error)
      return { error: 'An unexpected error occurred during sign in' }
    } finally {
      setLoading(false)
    }
  }

  /**
   * Sign up new user with email and password.
   * 
   * Creates new user account and sends verification email.
   * User must verify email before they can successfully sign in.
   * 
   * @param credentials - Registration data with password confirmation
   * @returns Object with error message or null on success
   */
  const signUp = async (credentials: RegisterCredentials): Promise<{ error: string | null }> => {
    try {
      setLoading(true)
      const result = await authService.signUp(credentials)

      if (result.error) {
        return { error: result.error.message }
      }

      return { error: null }
    } catch (error) {
      console.error('Sign up error:', error)
      return { error: 'An unexpected error occurred during registration' }
    } finally {
      setLoading(false)
    }
  }

  /**
   * Sign out current user and clear authentication state.
   * 
   * Terminates user session and clears all local auth state.
   * Always succeeds from UI perspective even if API call fails.
   * Redirects to home page using Next.js router for SPA navigation.
   */
  const signOut = async (): Promise<void> => {
    try {
      setLoading(true)
      await authService.signOut()
      
      // Clear local state immediately for responsive UI
      setUser(null)
      setSession(null)
      
      // Use Next.js router for client-side navigation
      router.push('/')
    } catch (error) {
      console.error('Sign out error:', error)
      // Still clear local state even if API call failed
      setUser(null)
      setSession(null)
      
      // Redirect to home page even if sign out API failed
      router.push('/')
    } finally {
      setLoading(false)
    }
  }

  /**
   * Request password reset email for user.
   * 
   * Sends secure password reset link to user's email address.
   * Link contains time-limited token for password reset completion.
   * 
   * @param request - Email address for password reset
   * @returns Object with error message or null on success
   */
  const resetPassword = async (request: PasswordResetRequest): Promise<{ error: string | null }> => {
    try {
      setLoading(true)
      const result = await authService.resetPassword(request)

      if (result.error) {
        return { error: result.error.message }
      }

      return { error: null }
    } catch (error) {
      console.error('Password reset error:', error)
      return { error: 'An unexpected error occurred while requesting password reset' }
    } finally {
      setLoading(false)
    }
  }

  /**
   * Update user password using reset token.
   * 
   * Completes password reset flow using secure token from email link.
   * Token is automatically handled by Supabase client from URL parameters.
   * 
   * @param newPassword - New password data with confirmation
   * @returns Object with error message or null on success
   */
  const updatePassword = async (newPassword: NewPasswordData): Promise<{ error: string | null }> => {
    try {
      setLoading(true)
      const result = await authService.updatePassword(newPassword)

      if (result.error) {
        return { error: result.error.message }
      }

      return { error: null }
    } catch (error) {
      console.error('Password update error:', error)
      return { error: 'An unexpected error occurred while updating password' }
    } finally {
      setLoading(false)
    }
  }

  // Create context value with all auth state and operations
  const value: AuthContextType = {
    user,
    session,
    loading,
    signIn,
    signUp,
    signOut,
    resetPassword,
    updatePassword,
    isAuthenticated: user !== null && session !== null,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

/**
 * Hook to access authentication context.
 * 
 * Provides type-safe access to authentication state and operations.
 * Must be used within AuthProvider or will throw helpful error.
 * 
 * @returns Authentication context with user state and auth operations
 * @throws Error if used outside of AuthProvider
 */
export function useAuth(): AuthContextType {
  const context = useContext(AuthContext)
  
  if (context === undefined) {
    throw new Error(
      'useAuth must be used within an AuthProvider. ' +
      'Make sure your component is wrapped in <AuthProvider>.'
    )
  }
  
  return context
}