'use client'

import { useState } from 'react'
import { useChallenge } from '@/hooks/use-challenge'
import { AppHeader } from '@/components/tracker/app-header'
import { EmptyState } from '@/components/tracker/empty-state'
import { TodayPanel } from '@/components/tracker/today-panel'
import { ProgressPanel } from '@/components/tracker/progress-panel'
import { StatsGrid } from '@/components/tracker/stats-grid'
import { DayGrid } from '@/components/tracker/day-grid'
import { SummaryDashboard } from '@/components/tracker/summary-dashboard'
import { ConfirmDialog } from '@/components/tracker/confirm-dialog'
import { LoadingState } from '@/components/tracker/loading-state'

type PendingAction = 'reset' | 'restart' | null

interface TrackerAppProps {
  userId: string
  email: string
}

export function TrackerApp({ userId, email }: TrackerAppProps) {
  const { isReady, loadError, syncError, today, data, days, stats, start, tickToday, reset, restart } =
    useChallenge(userId)
  const [pendingAction, setPendingAction] = useState<PendingAction>(null)

  const handleConfirm = () => {
    if (pendingAction === 'reset') reset()
    if (pendingAction === 'restart') restart()
    setPendingAction(null)
  }

  return (
    <div className="flex min-h-dvh flex-col">
      <AppHeader
        today={today}
        email={email}
        canReset={Boolean(data)}
        onReset={() => setPendingAction('reset')}
      />

      <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-6 px-4 py-6 sm:px-6 sm:py-10">
        {(syncError || loadError) && (
          <p
            role="alert"
            className="rounded-xl border border-missed/30 bg-missed/10 px-4 py-3 text-sm text-missed"
          >
            {syncError ?? loadError}
          </p>
        )}
        {!isReady || !today ? (
          <LoadingState />
        ) : !data || !stats ? (
          <EmptyState today={today} onStart={start} />
        ) : stats.phase === 'finished' ? (
          <SummaryDashboard
            data={data}
            days={days}
            stats={stats}
            onStartNew={() => setPendingAction('restart')}
          />
        ) : (
          <>
            <section
              aria-label="Today and progress"
              className="grid gap-4 lg:grid-cols-5"
            >
              <TodayPanel
                className="lg:col-span-3"
                today={today}
                stats={stats}
                onTick={tickToday}
              />
              <ProgressPanel className="lg:col-span-2" stats={stats} />
            </section>
            <StatsGrid stats={stats} />
            <DayGrid days={days} onTick={tickToday} />
          </>
        )}
      </main>

      <ConfirmDialog
        open={pendingAction !== null}
        title={pendingAction === 'restart' ? 'Start a new challenge?' : 'Reset this challenge?'}
        description={
          pendingAction === 'restart'
            ? 'Your finished challenge will be cleared and a new 25-day challenge will begin today. This cannot be undone.'
            : 'All ticks, missed days, and streaks will be permanently erased. This cannot be undone.'
        }
        confirmLabel={pendingAction === 'restart' ? 'Start new challenge' : 'Reset challenge'}
        onConfirm={handleConfirm}
        onCancel={() => setPendingAction(null)}
      />
    </div>
  )
}
