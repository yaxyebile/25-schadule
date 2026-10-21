import { ArrowRight, CalendarCheck, Lock, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { CHALLENGE_LENGTH, getEndDate } from '@/lib/challenge'
import { formatLongDate, type DateKey } from '@/lib/date-utils'
import { cn } from '@/lib/utils'

interface EmptyStateProps {
  today: DateKey
  onStart: () => void
}

const RULES = [
  {
    icon: CalendarCheck,
    title: 'Tick only today',
    body: 'Each day unlocks on its calendar date and can be ticked once.',
  },
  {
    icon: X,
    title: 'Midnight is final',
    body: 'An unticked day becomes missed at local midnight and stays locked.',
  },
  {
    icon: Lock,
    title: '25 consecutive days',
    body: 'The challenge ends after 25 calendar days, no matter what.',
  },
]

const PREVIEW_PATTERN = [
  'c', 'c', 'c', 'm', 'c',
  'c', 'c', 't', 'u', 'u',
  'u', 'u', 'u', 'u', 'u',
  'u', 'u', 'u', 'u', 'u',
  'u', 'u', 'u', 'u', 'u',
]

export function EmptyState({ today, onStart }: EmptyStateProps) {
  return (
    <section
      aria-labelledby="empty-title"
      className="grid items-center gap-10 py-4 animate-in fade-in slide-in-from-bottom-2 duration-500 md:grid-cols-2 md:py-12"
    >
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-3">
          <p className="text-sm font-medium text-success">The 25-day challenge</p>
          <h1
            id="empty-title"
            className="text-4xl font-semibold tracking-tight text-balance sm:text-5xl"
          >
            One tick a day. Twenty-five days.
          </h1>
          <p className="leading-relaxed text-muted-foreground text-pretty">
            Commit to a daily habit and show up for it. Your progress is saved to your account,
            syncs across devices, and updates itself with the calendar.
          </p>
        </div>

        <ul className="flex flex-col gap-4">
          {RULES.map(({ icon: Icon, title, body }) => (
            <li key={title} className="flex gap-3">
              <span className="flex size-9 shrink-0 items-center justify-center rounded-lg border border-border bg-muted text-foreground">
                <Icon className="size-4" aria-hidden="true" />
              </span>
              <div className="flex flex-col">
                <span className="text-sm font-medium">{title}</span>
                <span className="text-sm leading-relaxed text-muted-foreground">{body}</span>
              </div>
            </li>
          ))}
        </ul>

        <div className="flex flex-col gap-3">
          <Button
            onClick={onStart}
            className="h-12 w-full gap-2 rounded-xl bg-success px-6 text-base text-success-foreground shadow-sm hover:bg-success/90 sm:w-fit"
          >
            Start challenge
            <ArrowRight aria-hidden="true" />
          </Button>
          <p className="text-sm text-muted-foreground">
            Starts today, {formatLongDate(today)}. Ends{' '}
            {formatLongDate(getEndDate(today))}.
          </p>
        </div>
      </div>

      <div
        aria-hidden="true"
        className="rounded-3xl border border-border bg-card p-5 shadow-sm sm:p-8"
      >
        <div className="grid grid-cols-5 gap-2 sm:gap-3">
          {PREVIEW_PATTERN.slice(0, CHALLENGE_LENGTH).map((kind, index) => (
            <div
              key={index}
              style={{ animationDelay: `${index * 25}ms` }}
              className={cn(
                'flex aspect-square items-center justify-center rounded-xl font-mono text-xs animate-in fade-in zoom-in-90 fill-mode-both duration-500',
                kind === 'c' && 'bg-success text-success-foreground',
                kind === 'm' && 'bg-missed/10 text-missed',
                kind === 't' && 'border-2 border-today bg-today/5 text-today',
                kind === 'u' && 'bg-muted text-muted-foreground',
              )}
            >
              {index + 1}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
