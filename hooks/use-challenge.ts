'use client'

import { useCallback, useMemo, useState } from 'react'
import useSWR from 'swr'
import { useToday } from '@/hooks/use-today'
import {
  computeStats,
  createChallenge,
  deriveDays,
  fromRow,
  tickDate,
  type ChallengeData,
  type ChallengeRow,
} from '@/lib/challenge'
import { createClient } from '@/lib/supabase/client'

async function fetchChallenge(userId: string): Promise<ChallengeData | null> {
  const { data, error } = await createClient()
    .from('challenges')
    .select('start_date, completed_dates')
    .eq('user_id', userId)
    .maybeSingle<ChallengeRow>()
  if (error) throw error
  return fromRow(data)
}

async function saveChallenge(userId: string, challenge: ChallengeData) {
  const { error } = await createClient().from('challenges').upsert({
    user_id: userId,
    start_date: challenge.startDate,
    completed_dates: challenge.completedDates,
    updated_at: new Date().toISOString(),
  })
  if (error) throw error
}

async function deleteChallenge(userId: string) {
  const { error } = await createClient().from('challenges').delete().eq('user_id', userId)
  if (error) throw error
}

export function useChallenge(userId: string) {
  const [today, syncToday] = useToday()
  const [syncError, setSyncError] = useState<string | null>(null)
  const {
    data,
    error: loadError,
    isLoading,
    mutate,
  } = useSWR(['challenge', userId], () => fetchChallenge(userId), {
    revalidateOnFocus: true,
  })

  const challenge = data ?? null
  const days = useMemo(
    () => (challenge && today ? deriveDays(challenge, today) : []),
    [challenge, today],
  )
  const stats = useMemo(
    () => (challenge && today ? computeStats(challenge, days, today) : null),
    [challenge, days, today],
  )

  const persist = useCallback(
    async (next: ChallengeData | null, write: () => Promise<void>) => {
      setSyncError(null)
      try {
        await mutate(
          async () => {
            await write()
            return next
          },
          { optimisticData: next, rollbackOnError: true, revalidate: false },
        )
      } catch (error) {
        console.error('Failed to save challenge:', error)
        setSyncError('Could not save your progress. Check your connection and try again.')
      }
    },
    [mutate],
  )

  const start = useCallback(() => {
    const next = createChallenge(syncToday())
    void persist(next, () => saveChallenge(userId, next))
  }, [persist, syncToday, userId])

  const tickToday = useCallback(() => {
    // Re-read the clock at click time so a screen left open past midnight can
    // never tick the wrong (now missed) day.
    const freshToday = syncToday()
    if (!challenge) return
    const next = tickDate(challenge, freshToday)
    if (!next) return
    void persist(next, () => saveChallenge(userId, next))
  }, [challenge, persist, syncToday, userId])

  const reset = useCallback(() => {
    void persist(null, () => deleteChallenge(userId))
  }, [persist, userId])

  const restart = useCallback(() => {
    const next = createChallenge(syncToday())
    void persist(next, () => saveChallenge(userId, next))
  }, [persist, syncToday, userId])

  return {
    isReady: !isLoading && today !== null,
    loadError: loadError ? 'Could not load your challenge. Please refresh the page.' : null,
    syncError,
    today,
    data: challenge,
    days,
    stats,
    start,
    tickToday,
    reset,
    restart,
  }
}
