/**
 * Dashboard page component - protected route for authenticated users.
 * 
 * This page serves as the main landing page after successful authentication.
 * It displays user-specific content and provides navigation to other features.
 * The page is protected by middleware and requires valid authentication.
 * 
 * Features include user welcome message, navigation to key features,
 * and quick actions for workout management.
 */

'use client'

import { useAuth } from '@/hooks/use-auth'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { toast } from 'sonner'

/**
 * Dashboard page component for authenticated users.
 * 
 * Displays personalized dashboard content including:
 * - Welcome message with user email
 * - Quick action buttons for common tasks
 * - Navigation to key features
 * - Sign out functionality
 */
export default function DashboardPage() {
  const { user, signOut, loading } = useAuth()

  /**
   * Handle user sign out with confirmation.
   * 
   * Signs out the user and shows success feedback. The auth hook
   * will automatically redirect to the home page after sign out.
   */
  const handleSignOut = async () => {
    try {
      await signOut()
      
      toast.success('Signed out successfully', {
        description: 'You have been logged out of your account',
        duration: 3000,
      })
    } catch (error) {
      console.error('Sign out error:', error)
      toast.error('Sign out failed', {
        description: 'There was a problem signing you out. Please try again.',
        duration: 5000,
      })
    }
  }

  /**
   * Handle placeholder actions for future features.
   * 
   * Shows info toasts for features that will be implemented
   * in future development phases.
   */
  const handlePlaceholderAction = (feature: string) => {
    toast.info(`${feature} coming soon`, {
      description: `${feature} functionality will be available in upcoming updates`,
      duration: 4000,
    })
  }

  // Show loading state while authentication is being verified
  if (loading) {
    return (
      <div className="flex min-h-svh w-full items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      {/* Header Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">
          Welcome back{user?.email ? `, ${user.email.split('@')[0]}` : ''}!
        </h1>
        <p className="text-muted-foreground">
          Track your fitness journey and monitor your workout progress.
        </p>
      </div>

      {/* Quick Actions Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Start Workout</CardTitle>
            <CardDescription>
              Begin a new workout session and track your exercises
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              className="w-full" 
              onClick={() => handlePlaceholderAction('Workout tracking')}
            >
              Start New Workout
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">View Progress</CardTitle>
            <CardDescription>
              Check your fitness progress and workout history
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => handlePlaceholderAction('Progress tracking')}
            >
              View Progress
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Workout Plans</CardTitle>
            <CardDescription>
              Browse and create custom workout plans
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => handlePlaceholderAction('Workout plans')}
            >
              Browse Plans
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* User Info Section */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-lg">Account Information</CardTitle>
          <CardDescription>
            Your account details and settings
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between items-center py-2 border-b">
            <span className="font-medium">Email:</span>
            <span className="text-muted-foreground">{user?.email}</span>
          </div>
          <div className="flex justify-between items-center py-2 border-b">
            <span className="font-medium">Account Status:</span>
            <span className="text-green-600">Active</span>
          </div>
          <div className="flex justify-between items-center py-2">
            <span className="font-medium">Member Since:</span>
            <span className="text-muted-foreground">
              {user?.created_at ? new Date(user.created_at).toLocaleDateString() : 'Recently'}
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Sign Out Section */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Account Actions</CardTitle>
          <CardDescription>
            Manage your account and session
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <Button 
              variant="outline"
              onClick={() => handlePlaceholderAction('Profile settings')}
            >
              Edit Profile
            </Button>
            <Button 
              variant="destructive"
              onClick={handleSignOut}
            >
              Sign Out
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}