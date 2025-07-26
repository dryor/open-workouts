/**
 * Home page component - landing page for Open Workouts.
 * 
 * This page serves as the public landing page for the application,
 * providing information about the app and navigation to authentication.
 * It's accessible to all users regardless of authentication status.
 */

'use client'

import Link from "next/link"
import { useAuth } from '@/hooks/use-auth'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function Home() {
  const { user, loading } = useAuth()

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted">
      {/* Navigation */}
      <nav className="border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-xl font-bold">Open Workouts</h1>
          <div className="flex gap-2">
            {loading ? (
              <div className="animate-pulse">
                <div className="h-9 w-20 bg-muted rounded"></div>
              </div>
            ) : user ? (
              <Button asChild>
                <Link href="/dashboard">Dashboard</Link>
              </Button>
            ) : (
              <>
                <Button variant="outline" asChild>
                  <Link href="/auth/login">Sign In</Link>
                </Button>
                <Button asChild>
                  <Link href="/auth/register">Get Started</Link>
                </Button>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-4xl md:text-6xl font-bold mb-6">
          Track Your Fitness Journey
        </h1>
        <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
          Open source workout tracking web app focused on simplicity and progress visualization. 
          Start your fitness journey today with our clean, intuitive interface.
        </p>
        
        {!user && !loading && (
          <div className="flex gap-4 justify-center">
            <Button size="lg" asChild>
              <Link href="/auth/register">Start Free</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/auth/login">Sign In</Link>
            </Button>
          </div>
        )}

        {user && (
          <Button size="lg" asChild>
            <Link href="/dashboard">Go to Dashboard</Link>
          </Button>
        )}
      </div>

      {/* Features Section */}
      <div className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-12">
          Why Choose Open Workouts?
        </h2>
        
        <div className="grid md:grid-cols-3 gap-8">
          <Card>
            <CardHeader>
              <CardTitle>Simple & Clean</CardTitle>
              <CardDescription>
                Intuitive interface designed for focus, not distraction
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                No cluttered dashboards or confusing menus. Just clean, 
                straightforward workout tracking that gets out of your way.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Progress Visualization</CardTitle>
              <CardDescription>
                See your improvements with clear, meaningful charts
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Track your progress over time with beautiful visualizations 
                that show your fitness journey at a glance.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Open Source</CardTitle>
              <CardDescription>
                Transparent, community-driven development
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Built in the open with modern technologies. Your data stays 
                yours, and you can contribute to making it better.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* CTA Section */}
      {!user && !loading && (
        <div className="bg-muted py-16">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-4">
              Ready to Start Your Journey?
            </h2>
            <p className="text-muted-foreground mb-8">
              Join the community and start tracking your workouts today
            </p>
            <Button size="lg" asChild>
              <Link href="/auth/register">Create Your Account</Link>
            </Button>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="border-t py-8">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>
            © 2025 Open Workouts. Built with ❤️ using Next.js, Supabase, and shadcn/ui.
          </p>
        </div>
      </footer>
    </div>
  )
}
