'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { LogOut } from 'lucide-react'
import { toast } from 'sonner'

interface SignOutButtonProps {
  signOutAction: () => Promise<{ error?: string }>
}

export function SignOutButton({ signOutAction }: SignOutButtonProps) {
  const [isLoading, setIsLoading] = useState(false)

  const handleSignOut = async () => {
    setIsLoading(true)
    
    const result = await signOutAction()
    
    if (result?.error) {
      toast.error(result.error)
      setIsLoading(false)
    }
    // If no error, redirect happens automatically via server action
  }

  return (
    <Button
      variant="outline"
      size="sm"
      className="gap-2 cursor-pointer"
      onClick={handleSignOut}
      disabled={isLoading}
    >
      <LogOut className="w-4 h-4" />
      {isLoading ? 'Signing out...' : 'Sign Out'}
    </Button>
  )
}