import { Check, Lock, Plus, X, type LucideIcon } from 'lucide-react'
import type { ChallengeDay, DayStatus } from '@/lib/challenge'
import { formatShortDate, formatWeekday } from '@/lib/date-utils'
import { cn } from '@/lib/utils'

interface DayCardProps {
  day: ChallengeDay
  onTick?: () => void
}

const STATUS_CONFIG: Record<
  DayStatus,
  { label: string; icon: LucideIcon; card: string; meta: string }
> = {
  completed: {
    label: 'Completed',
    icon: Check,
    card: 'border-success bg-success text-success-foreground shadow-sm',
    meta: 'text-success-foreground/80',
  },
  missed: {
    label: 'Missed',
    icon: X,
    card: 'border-missed/25 bg-missed/8 text-missed',
    meta: 'text-missed/80',
  },
  today: {
    label: 'Today, tap to tick',
    icon: Plus,
    card: 'border-today bg-today/5 text-today ring-4 ring-today/15 shadow-sm hover:bg-today/10 cursor-pointer',
    meta: 'text-today/80',
  },
  upcoming: {
    label: 'Locked',
    icon: Lock,
    card: 'border-border bg-muted/60 text-muted-foreground',
    meta: 'text-muted-foreground',
  },
}

export function DayCard({ day, onTick }: DayCardProps) {
  const config = STATUS_CONFIG[day.status]
  const Icon = config.icon
  const isTickable = day.status === 'today' && Boolean(onTick)
  const accessibleLabel = `Day ${day.dayNumber}, ${formatWeekday(day.date)} ${formatShortDate(day.date)}: ${config.label}`

  return (
    <button
      type="button"
      onClick={isTickable ? onTick : undefined}
      disabled={!isTickable}
      aria-label={accessibleLabel}
      title={accessibleLabel}
      style={{ animationDelay: `${(day.dayNumber - 1) * 20}ms` }}
      className={cn(
        'group relative flex aspect-square w-full flex-col justify-between rounded-xl border p-1.5 text-left transition-all duration-300 animate-in fade-in zoom-in-95 fill-mode-both outline-none focus-visible:ring-4 focus-visible:ring-ring/40 disabled:cursor-default sm:rounded-2xl sm:p-3 md:aspect-video',
        isTickable && 'active:scale-95',
        config.card,
      )}
    >
      <div className="flex items-start justify-between gap-1">
        <span className="flex flex-col">
          <span className={cn('hidden text-xs font-medium sm:block', config.meta)}>Day</span>
          <span className="font-mono text-sm font-semibold leading-none sm:text-xl">
            {day.dayNumber}
          </span>
        </span>
        <Icon
          aria-hidden="true"
          strokeWidth={day.status === 'completed' ? 3 : 2}
          className={cn(
            'size-3.5 shrink-0 sm:size-5',
            day.status === 'completed' && 'animate-in zoom-in-50 duration-300',
            day.status === 'today' && 'transition-transform group-hover:scale-110',
          )}
        />
      </div>
      <span className={cn('hidden text-xs sm:block', config.meta)}>
        {formatWeekday(day.date)} {formatShortDate(day.date)}
      </span>
    </button>
  )
}
