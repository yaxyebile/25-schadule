import type { ChallengeDay } from '@/lib/challenge'
import { DayCard } from '@/components/tracker/day-card'

interface DayGridProps {
  days: ChallengeDay[]
  onTick?: () => void
  title?: string
}

const LEGEND = [
  { label: 'Completed', swatch: 'bg-success' },
  { label: 'Missed', swatch: 'bg-missed/20 ring-1 ring-missed/40' },
  { label: 'Today', swatch: 'bg-today/10 ring-2 ring-today' },
  { label: 'Upcoming', swatch: 'bg-muted ring-1 ring-border' },
]

export function DayGrid({ days, onTick, title = 'Your 25 days' }: DayGridProps) {
  return (
    <section aria-labelledby="day-grid-title" className="flex flex-col gap-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 id="day-grid-title" className="text-lg font-semibold tracking-tight">
          {title}
        </h2>
        <ul className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-muted-foreground">
          {LEGEND.map(({ label, swatch }) => (
            <li key={label} className="flex items-center gap-1.5">
              <span aria-hidden="true" className={`size-3 rounded-sm ${swatch}`} />
              {label}
            </li>
          ))}
        </ul>
      </div>

      <ol className="grid grid-cols-5 gap-2 sm:gap-3">
        {days.map((day) => (
          <li key={day.date}>
            <DayCard day={day} onTick={onTick} />
          </li>
        ))}
      </ol>
    </section>
  )
}
