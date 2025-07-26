import { container, TYPES } from '@/lib/auth/container'
import type { ISessionManager } from '@/lib/auth/interfaces/ISessionManager'
import { Hero } from '@/components/landing/Hero'
import { BuildingStatus } from '@/components/landing/BuildingStatus'
import { CTAButtons } from '@/components/landing/CTAButtons'

export default async function LandingPage() {
  const sessionManager = container.get<ISessionManager>(TYPES.ISessionManager)
  const user = await sessionManager.getCurrentUser()

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Hero />
      <BuildingStatus />
      <CTAButtons isAuthenticated={!!user} />
    </div>
  )
}
