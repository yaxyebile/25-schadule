import { addDays, diffInCalendarDays, isValidDateKey, type DateKey } from '@/lib/date-utils'

export const CHALLENGE_LENGTH = 25

export type DayStatus = 'completed' | 'missed' | 'today' | 'upcoming'

/**
 * Only the start date and ticked dates are stored. Missed days are derived from
 * the calendar, so they stay correct even when the app was closed for days.
 */
export interface ChallengeData {
  startDate: DateKey
  completedDates: DateKey[]
}

export interface ChallengeRow {
  start_date: string
  completed_dates: string[] | null
}

export interface ChallengeDay {
  dayNumber: number
  date: DateKey
  status: DayStatus
}

export type ChallengePhase = 'active' | 'finished'

export interface ChallengeStats {
  phase: ChallengePhase
  currentDayNumber: number | null
  endDate: DateKey
  completed: number
  missed: number
  remaining: number
  completionPercent: number
  currentStreak: number
  longestStreak: number
  isTodayCompleted: boolean
}

export function getEndDate(startDate: DateKey): DateKey {
  return addDays(startDate, CHALLENGE_LENGTH - 1)
}

export function getChallengeDates(startDate: DateKey): DateKey[] {
  return Array.from({ length: CHALLENGE_LENGTH }, (_, index) => addDays(startDate, index))
}

function isWithinChallenge(startDate: DateKey, date: DateKey): boolean {
  const offset = diffInCalendarDays(date, startDate)
  return offset >= 0 && offset < CHALLENGE_LENGTH
}

export function createChallenge(today: DateKey): ChallengeData {
  return { startDate: today, completedDates: [] }
}

/** Ticks `today` if it is the active, un-ticked challenge day. Returns null otherwise. */
export function tickDate(data: ChallengeData, today: DateKey): ChallengeData | null {
  if (!isWithinChallenge(data.startDate, today)) return null
  if (data.completedDates.includes(today)) return null
  return { ...data, completedDates: [...data.completedDates, today].sort() }
}

export function deriveDays(data: ChallengeData, today: DateKey): ChallengeDay[] {
  const completed = new Set(data.completedDates)
  return getChallengeDates(data.startDate).map((date, index) => {
    let status: DayStatus
    if (completed.has(date)) status = 'completed'
    else if (date < today) status = 'missed'
    else if (date === today) status = 'today'
    else status = 'upcoming'
    return { dayNumber: index + 1, date, status }
  })
}

export function computeStats(
  data: ChallengeData,
  days: ChallengeDay[],
  today: DateKey,
): ChallengeStats {
  const endDate = getEndDate(data.startDate)
  const completed = days.filter((day) => day.status === 'completed').length
  const missed = days.filter((day) => day.status === 'missed').length
  const offset = diffInCalendarDays(today, data.startDate)
  const currentDayNumber = offset >= 0 && offset < CHALLENGE_LENGTH ? offset + 1 : null
  const phase: ChallengePhase = today > endDate ? 'finished' : 'active'

  let longestStreak = 0
  let run = 0
  for (const day of days) {
    run = day.status === 'completed' ? run + 1 : 0
    longestStreak = Math.max(longestStreak, run)
  }

  // An un-ticked "today" is still open, so it does not break the streak.
  let currentStreak = 0
  const resolvedDays = days.filter((day) => day.status === 'completed' || day.status === 'missed')
  const todayCompleted = days.some((day) => day.date === today && day.status === 'completed')
  for (let index = resolvedDays.length - 1; index >= 0; index--) {
    if (resolvedDays[index].status !== 'completed') break
    currentStreak++
  }

  return {
    phase,
    currentDayNumber,
    endDate,
    completed,
    missed,
    remaining: CHALLENGE_LENGTH - completed - missed,
    completionPercent: Math.round((completed / CHALLENGE_LENGTH) * 100),
    currentStreak,
    longestStreak,
    isTodayCompleted: todayCompleted,
  }
}

export function fromRow(row: ChallengeRow | null): ChallengeData | null {
  if (!row || !isValidDateKey(row.start_date)) return null
  const startDate = row.start_date
  const completedDates = Array.from(
    new Set(
      (row.completed_dates ?? []).filter(
        (date): date is DateKey => isValidDateKey(date) && isWithinChallenge(startDate, date),
      ),
    ),
  ).sort()
  return { startDate, completedDates }
}
