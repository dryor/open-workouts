import Link from "next/link"
import { Button } from "@/components/ui/button"
import { LogIn, UserPlus, ArrowRight } from "lucide-react"

interface CTAButtonsProps {
  isAuthenticated: boolean
}

export function CTAButtons({ isAuthenticated }: CTAButtonsProps) {
  if (isAuthenticated) {
    return (
      <div className="flex justify-center">
        <Button asChild size="lg" className="gap-2 cursor-pointer">
          <Link href="/dashboard">
            Go to Dashboard
            <ArrowRight className="w-4 h-4" />
          </Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
      <Button asChild size="lg" className="gap-2 cursor-pointer">
        <Link href="/auth/login">
          <LogIn className="w-4 h-4" />
          Login
        </Link>
      </Button>
      <Button asChild variant="outline" size="lg" className="gap-2 cursor-pointer">
        <Link href="/auth/register">
          <UserPlus className="w-4 h-4" />
          Sign Up
        </Link>
      </Button>
    </div>
  )
}