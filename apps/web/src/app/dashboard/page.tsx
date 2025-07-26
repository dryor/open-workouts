import { redirect } from 'next/navigation'
import { container, TYPES } from '@/lib/auth/container'
import type { ISessionManager } from '@/lib/auth/interfaces/ISessionManager'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { User } from 'lucide-react'
import { SignOutButton } from '@/components/auth/SignOutButton'

async function signOutAction() {
  'use server'
  
  let authResult
  try {
    const authService = container.get(TYPES.IAuthService)
    authResult = await authService.signOut()
  } catch (error) {
    return { error: 'Sign out failed' }
  }

  if (authResult.error) {
    return { error: authResult.error.message }
  }

  // Redirect OUTSIDE try-catch block (official Next.js recommendation)
  redirect('/')
}

export default async function DashboardPage() {
  const sessionManager = container.get<ISessionManager>(TYPES.ISessionManager)
  const user = await sessionManager.getCurrentUser()

  if (!user) {
    redirect('/auth/login')
  }

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        <header className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <p className="text-muted-foreground">Welcome back to Open Workouts</p>
          </div>
          <SignOutButton signOutAction={signOutAction} />
        </header>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Profile</CardTitle>
              <User className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{user.email}</div>
              <p className="text-xs text-muted-foreground">
                Member since {new Date(user.created_at).toLocaleDateString()}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Coming Soon</CardTitle>
              <CardDescription>Workout tracking features</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                We&apos;re building amazing workout tracking features for you.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Coming Soon</CardTitle>
              <CardDescription>Progress visualization</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Track your fitness journey with beautiful charts and insights.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}