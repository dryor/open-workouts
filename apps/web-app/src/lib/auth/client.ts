/**
 * Client-side Supabase utilities for browser authentication.
 * 
 * This module provides proper client-side Supabase configuration following
 * the official Next.js integration guide. It handles browser-specific
 * authentication flows and session management.
 * 
 * @see https://supabase.com/docs/guides/auth/server-side/nextjs
 */

'use client'

import { createBrowserClient } from '@supabase/ssr'

// Validate required environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Missing Supabase environment variables. Please check .env.local file contains:\n' +
    '- NEXT_PUBLIC_SUPABASE_URL\n' +
    '- NEXT_PUBLIC_SUPABASE_ANON_KEY'
  )
}

/**
 * Create browser client for client-side operations.
 * 
 * This client handles authentication state, user sessions, and client-side
 * database operations. Automatically manages session persistence using
 * browser cookies and localStorage.
 * 
 * Used by:
 * - Authentication forms and components
 * - Client-side auth state management
 * - Protected route components
 */
export function createClient() {
  return createBrowserClient(supabaseUrl, supabaseAnonKey)
}