export function Hero() {
  return (
    <section className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center">
      <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
        Open Workouts
      </h1>
      <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-2xl">
        Track your fitness journey with simplicity and progress visualization
      </p>
    </section>
  )
}