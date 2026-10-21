import { CircleCheck, CircleX, RotateCcw, Trophy } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { CHALLENGE_LENGTH, type ChallengeData, type ChallengeDay, type ChallengeStats } from '@/lib/challenge'
import { formatLongDate } from '@/lib/date-utils'
import { DayGrid } from '@/components/tracker/day-grid'
import { ProgressBar } from '@/components/tracker/progress-bar'

interface SummaryDashboardProps {
  data: ChallengeData
  days: ChallengeDay[]
  stats: ChallengeStats
  onStartNew: () => void
}

function getHeadline(percent: number): string {
  if (percent === 100) return 'A perfect run.'
  if (percent >= 80) return 'Outstanding consistency.'
  if (percent >= 50) return 'Solid follow-through.'
  return 'Every tick counted.'
}

export function SummaryDashboard({ data, days, stats, onStartNew }: SummaryDashboardProps) {
  const summaryItems = [
    { label: 'Completed days', value: stats.completed, icon: CircleCheck, tone: 'text-success' },
    { label: 'Missed days', value: stats.missed, icon: CircleX, tone: 'text-missed' },
    { label: 'Longest streak', value: stats.longestStreak, icon: Trophy, tone: 'text-today' },
  ]

  return (
    <>
      <section
        aria-labelledby="summary-title"
        className="flex flex-col gap-8 rounded-3xl border border-border bg-card p-6 shadow-sm animate-in fade-in slide-in-from-bottom-2 duration-500 sm:p-10"
      >
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div className="flex flex-col gap-2">
            <p className="text-sm font-medium text-success">Challenge complete</p>
            <h1 id="summary-title" className="text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
              {getHeadline(stats.completionPercent)}
            </h1>
            <p className="text-sm leading-relaxed text-muted-foreground">
              {formatLongDate(data.startDate)} – {formatLongDate(stats.endDate)}
            </p>
          </div>
          <div className="flex flex-col md:items-end">
            <span className="text-sm text-muted-foreground">Success rate</span>
            <span className="font-mono text-6xl font-semibold tracking-tight text-success">
              {stats.completionPercent}
              <span className="text-3xl">%</span>
            </span>
          </div>
        </div>

        <ProgressBar completed={stats.completed} missed={stats.missed} />

        <dl className="grid gap-3 sm:grid-cols-3">
          {summaryItems.map(({ label, value, icon: Icon, tone }) => (
            <div key={label} className="flex items-center gap-3 rounded-2xl bg-muted p-4">
              <Icon className={`size-5 ${tone}`} aria-hidden="true" />
              <div className="flex flex-col">
                <dt className="text-sm text-muted-foreground">{label}</dt>
                <dd className="font-mono text-xl font-semibold">
                  {value}
                  <span className="text-sm font-normal text-muted-foreground"> / {CHALLENGE_LENGTH}</span>
                </dd>
              </div>
            </div>
          ))}
        </dl>

        <Button
          onClick={onStartNew}
          className="h-12 w-full gap-2 rounded-xl px-6 text-base sm:w-fit"
        >
          <RotateCcw aria-hidden="true" />
          Start a new challenge
        </Button>
      </section>

      <DayGrid days={days} title="Day by day" />
    </>
  )
}
