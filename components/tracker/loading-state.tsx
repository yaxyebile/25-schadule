export function LoadingState() {
  return (
    <div role="status" aria-live="polite" className="flex flex-col gap-4">
      <span className="sr-only">Loading your challenge</span>
      <div className="grid gap-4 lg:grid-cols-5">
        <div className="h-52 animate-pulse rounded-2xl bg-muted lg:col-span-3" />
        <div className="h-52 animate-pulse rounded-2xl bg-muted lg:col-span-2" />
      </div>
      <div className="grid grid-cols-5 gap-2 sm:gap-3">
        {Array.from({ length: 25 }, (_, index) => (
          <div key={index} className="aspect-square animate-pulse rounded-xl bg-muted" />
        ))}
      </div>
    </div>
  )
}
