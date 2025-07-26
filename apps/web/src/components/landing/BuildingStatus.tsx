import { Card, CardContent } from "@/components/ui/card"

export function BuildingStatus() {
  return (
    <div className="flex justify-center px-4 mb-12">
      <Card className="w-full max-w-md">
        <CardContent className="pt-6">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
              <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
              In Development
            </div>
            <h2 className="text-lg font-semibold mb-2">Building something amazing...</h2>
            <p className="text-muted-foreground text-sm">
              We&apos;re crafting the perfect workout tracking experience for you.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}