/**
 * Local calendar date helpers.
 *
 * Dates are represented as "YYYY-MM-DD" keys built from the user's LOCAL
 * calendar (never `toISOString`, which converts to UTC and can shift the day).
 * Day differences are computed via Date.UTC on the key parts so DST
 * transitions (23h / 25h days) never produce off-by-one errors.
 */

export type DateKey = string

const DATE_KEY_PATTERN = /^\d{4}-\d{2}-\d{2}$/

function pad(value: number): string {
  return String(value).padStart(2, '0')
}

export function toDateKey(date: Date): DateKey {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`
}

export function getTodayKey(): DateKey {
  return toDateKey(new Date())
}

function splitKey(key: DateKey): [number, number, number] {
  const [year, month, day] = key.split('-').map(Number)
  return [year, month, day]
}

export function isValidDateKey(value: unknown): value is DateKey {
  if (typeof value !== 'string' || !DATE_KEY_PATTERN.test(value)) return false
  const [year, month, day] = splitKey(value)
  const date = new Date(year, month - 1, day)
  return (
    date.getFullYear() === year &&
    date.getMonth() === month - 1 &&
    date.getDate() === day
  )
}

export function parseDateKey(key: DateKey): Date {
  const [year, month, day] = splitKey(key)
  return new Date(year, month - 1, day)
}

export function addDays(key: DateKey, amount: number): DateKey {
  const [year, month, day] = splitKey(key)
  return toDateKey(new Date(year, month - 1, day + amount))
}

/** Whole calendar days from `from` to `to` (positive when `to` is later). */
export function diffInCalendarDays(to: DateKey, from: DateKey): number {
  const [ty, tm, td] = splitKey(to)
  const [fy, fm, fd] = splitKey(from)
  const MS_PER_DAY = 86_400_000
  return Math.round((Date.UTC(ty, tm - 1, td) - Date.UTC(fy, fm - 1, fd)) / MS_PER_DAY)
}

export function msUntilNextLocalMidnight(now: Date = new Date()): number {
  const nextMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1)
  return nextMidnight.getTime() - now.getTime()
}

const longFormatter = new Intl.DateTimeFormat(undefined, {
  weekday: 'long',
  month: 'long',
  day: 'numeric',
  year: 'numeric',
})

const shortFormatter = new Intl.DateTimeFormat(undefined, {
  month: 'short',
  day: 'numeric',
})

const weekdayFormatter = new Intl.DateTimeFormat(undefined, { weekday: 'short' })

export function formatLongDate(key: DateKey): string {
  return longFormatter.format(parseDateKey(key))
}

export function formatShortDate(key: DateKey): string {
  return shortFormatter.format(parseDateKey(key))
}

export function formatWeekday(key: DateKey): string {
  return weekdayFormatter.format(parseDateKey(key))
}

export function formatDuration(ms: number): string {
  const totalMinutes = Math.max(0, Math.ceil(ms / 60_000))
  const hours = Math.floor(totalMinutes / 60)
  const minutes = totalMinutes % 60
  if (hours === 0) return `${minutes}m`
  return `${hours}h ${pad(minutes)}m`
}
