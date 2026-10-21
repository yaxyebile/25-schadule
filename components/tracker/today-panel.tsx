'use client'

import { Check, Clock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useTimeUntilMidnight } from '@/hooks/use-today'
import { CHALLENGE_LENGTH, type ChallengeStats } from '@/lib/challenge'
import { formatDuration, formatLongDate, type DateKey } from '@/lib/date-utils'
import { cn } from '@/lib/utils'

interface TodayPanelProps {
  today: DateKey
  stats: ChallengeStats
  onTick: () => void
  className?: string
}

export function TodayPanel({ today, stats, onTick, className }: TodayPanelProps) {
  const timeLeft = useTimeUntilMidnight()
  const dayNumber = stats.currentDayNumber ?? CHALLENGE_LENGTH
  const isFinalDay = dayNumber === CHALLENGE_LENGTH
  const done = stats.isTodayCompleted

  return (
    <div
      className={cn(
        'flex flex-col justify-between gap-6 rounded-2xl border bg-card p-6 shadow-sm transition-colors duration-500 animate-in fade-in slide-in-from-bottom-2',
        done ? 'border-success/30' : 'border-today/30',
        className,
      )}
    >
      <div className="flex flex-col gap-1">
        <p className={cn('text-sm font-medium', done ? 'text-success' : 'text-today')}>
          {formatLongDate(today)}
        </p>
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
          Day <span className="font-mono">{dayNumber}</span>
          <span className="text-muted-foreground"> of {CHALLENGE_LENGTH}</span>
        </h1>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        {done ? (
          <div
            role="status"
            className="flex items-center gap-3 animate-in fade-in zoom-in-95 duration-300"
          >
            <span className="flex size-12 items-center justify-center rounded-full bg-success text-success-foreground shadow-sm">
              <Check className="size-6 animate-in zoom-in-50 duration-300" strokeWidth={3} aria-hidden="true" />
            </span>
            <div className="flex flex-col">
              <span className="font-medium">Day {dayNumber} ticked</span>
              <span className="text-sm text-muted-foreground">
                {isFinalDay
                  ? `Your summary unlocks in ${formatDuration(timeLeft)}`
                  : `Day ${dayNumber + 1} unlocks in ${formatDuration(timeLeft)}`}
              </span>
            </div>
          </div>
        ) : (
          <>
            <Button
              onClick={onTick}
              className="h-14 w-full gap-2 rounded-xl bg-success px-8 text-base font-semibold text-success-foreground shadow-sm hover:bg-success/90 sm:w-fit"
            >
              <Check className="size-5" strokeWidth={3} aria-hidden="true" />
              Tick day {dayNumber}
            </Button>
            <p className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="size-4 shrink-0" aria-hidden="true" />
              <span>
                <span className="font-mono font-medium text-foreground">
                  {formatDuration(timeLeft)}
                </span>{' '}
                left before it&apos;s missed
              </span>
            </p>
          </>
        )}
      </div>
    </div>
  )
}
