import { CircleCheck, CircleX, Flame, Hourglass, Trophy, type LucideIcon } from 'lucide-react'
import type { ChallengeStats } from '@/lib/challenge'
import { cn } from '@/lib/utils'

interface StatItem {
  label: string
  value: number
  unit?: string
  icon: LucideIcon
  tone: string
}

export function StatsGrid({ stats }: { stats: ChallengeStats }) {
  const items: StatItem[] = [
    { label: 'Completed', value: stats.completed, icon: CircleCheck, tone: 'text-success' },
    { label: 'Missed', value: stats.missed, icon: CircleX, tone: 'text-missed' },
    { label: 'Remaining', value: stats.remaining, icon: Hourglass, tone: 'text-muted-foreground' },
    {
      label: 'Current streak',
      value: stats.currentStreak,
      unit: stats.currentStreak === 1 ? 'day' : 'days',
      icon: Flame,
      tone: 'text-today',
    },
    {
      label: 'Longest streak',
      value: stats.longestStreak,
      unit: stats.longestStreak === 1 ? 'day' : 'days',
      icon: Trophy,
      tone: 'text-foreground',
    },
  ]

  return (
    <section aria-label="Challenge statistics">
      <dl className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        {items.map(({ label, value, unit, icon: Icon, tone }, index) => (
          <div
            key={label}
            style={{ animationDelay: `${index * 60}ms` }}
            className={cn(
              'flex flex-col gap-3 rounded-2xl border border-border bg-card p-4 shadow-sm animate-in fade-in slide-in-from-bottom-2 fill-mode-both duration-500',
              index === items.length - 1 && 'col-span-2 sm:col-span-1',
            )}
          >
            <dt className="flex items-center gap-2 text-sm text-muted-foreground">
              <Icon className={cn('size-4', tone)} aria-hidden="true" />
              {label}
            </dt>
            <dd className="flex items-baseline gap-1">
              <span className="font-mono text-2xl font-semibold tracking-tight">{value}</span>
              {unit && <span className="text-sm text-muted-foreground">{unit}</span>}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  )
}
