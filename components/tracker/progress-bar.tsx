'use client'

import { useEffect, useState } from 'react'
import { CHALLENGE_LENGTH } from '@/lib/challenge'

interface ProgressBarProps {
  completed: number
  missed: number
}

export function ProgressBar({ completed, missed }: ProgressBarProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    const frame = requestAnimationFrame(() => setMounted(true))
    return () => cancelAnimationFrame(frame)
  }, [])

  const completedPct = (completed / CHALLENGE_LENGTH) * 100
  const missedPct = (missed / CHALLENGE_LENGTH) * 100

  return (
    <div className="flex flex-col gap-3">
      <div
        role="progressbar"
        aria-label="Challenge completion"
        aria-valuemin={0}
        aria-valuemax={CHALLENGE_LENGTH}
        aria-valuenow={completed}
        aria-valuetext={`${completed} of ${CHALLENGE_LENGTH} days completed, ${missed} missed`}
        className="flex h-3 w-full overflow-hidden rounded-full bg-muted"
      >
        <div
          className="relative h-full overflow-hidden rounded-full bg-success transition-[width] duration-1000 ease-out"
          style={{ width: mounted ? `${completedPct}%` : '0%' }}
        >
          <span className="absolute inset-0 animate-[shimmer_2.4s_ease-in-out_infinite] bg-linear-to-r from-transparent via-success-foreground/30 to-transparent" />
        </div>
        <div
          className="h-full bg-missed/60 transition-[width] delay-150 duration-1000 ease-out"
          style={{ width: mounted ? `${missedPct}%` : '0%' }}
        />
      </div>
      <div className="flex items-center gap-4 text-xs text-muted-foreground">
        <span className="flex items-center gap-1.5">
          <span aria-hidden="true" className="size-2 rounded-full bg-success" />
          Completed
        </span>
        <span className="flex items-center gap-1.5">
          <span aria-hidden="true" className="size-2 rounded-full bg-missed/60" />
          Missed
        </span>
        <span className="flex items-center gap-1.5">
          <span aria-hidden="true" className="size-2 rounded-full bg-border" />
          Remaining
        </span>
      </div>
    </div>
  )
}
