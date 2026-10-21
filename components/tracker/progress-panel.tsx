import { CHALLENGE_LENGTH, type ChallengeStats } from '@/lib/challenge'
import { cn } from '@/lib/utils'
import { ProgressBar } from '@/components/tracker/progress-bar'

interface ProgressPanelProps {
  stats: ChallengeStats
  className?: string
}

export function ProgressPanel({ stats, className }: ProgressPanelProps) {
  return (
    <div
      className={cn(
        'flex flex-col justify-between gap-6 rounded-2xl border border-border bg-card p-6 shadow-sm animate-in fade-in slide-in-from-bottom-2 duration-500',
        className,
      )}
    >
      <div className="flex items-end justify-between gap-4">
        <div className="flex flex-col gap-1">
          <p className="text-sm font-medium text-muted-foreground">Completion</p>
          <p className="font-mono text-4xl font-semibold tracking-tight">
            {stats.completionPercent}
            <span className="text-2xl text-muted-foreground">%</span>
          </p>
        </div>
        <p className="pb-1 text-right text-sm text-muted-foreground">
          <span className="font-mono font-medium text-foreground">{stats.completed}</span> of{' '}
          {CHALLENGE_LENGTH} ticked
        </p>
      </div>

      <ProgressBar completed={stats.completed} missed={stats.missed} />
    </div>
  )
}
