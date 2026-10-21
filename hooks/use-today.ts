'use client'

import { useCallback, useEffect, useState } from 'react'
import { getTodayKey, msUntilNextLocalMidnight, type DateKey } from '@/lib/date-utils'

/**
 * Tracks the current LOCAL calendar date. Re-syncs at local midnight, on tab
 * focus / visibility change, and on a periodic safety interval (timers can be
 * frozen while a laptop sleeps or a tab is backgrounded).
 */
export function useToday(): [DateKey | null, () => DateKey] {
  const [today, setToday] = useState<DateKey | null>(null)

  const sync = useCallback(() => {
    const key = getTodayKey()
    setToday((previous) => (previous === key ? previous : key))
    return key
  }, [])

  useEffect(() => {
    let midnightTimer: ReturnType<typeof setTimeout> | undefined

    const scheduleMidnight = () => {
      clearTimeout(midnightTimer)
      midnightTimer = setTimeout(() => {
        sync()
        scheduleMidnight()
      }, msUntilNextLocalMidnight() + 250)
    }

    const handleWake = () => {
      if (document.visibilityState === 'hidden') return
      sync()
      scheduleMidnight()
    }

    sync()
    scheduleMidnight()
    const safetyInterval = setInterval(sync, 30_000)
    window.addEventListener('focus', handleWake)
    document.addEventListener('visibilitychange', handleWake)

    return () => {
      clearTimeout(midnightTimer)
      clearInterval(safetyInterval)
      window.removeEventListener('focus', handleWake)
      document.removeEventListener('visibilitychange', handleWake)
    }
  }, [sync])

  return [today, sync]
}

export function useTimeUntilMidnight(): number {
  const [remaining, setRemaining] = useState(() => msUntilNextLocalMidnight())

  useEffect(() => {
    const update = () => setRemaining(msUntilNextLocalMidnight())
    const interval = setInterval(update, 15_000)
    document.addEventListener('visibilitychange', update)
    return () => {
      clearInterval(interval)
      document.removeEventListener('visibilitychange', update)
    }
  }, [])

  return remaining
}
