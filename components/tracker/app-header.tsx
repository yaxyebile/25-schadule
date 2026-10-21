'use client'

import { useRouter } from 'next/navigation'
import { Check, LogOut, RotateCcw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { formatLongDate, type DateKey } from '@/lib/date-utils'
import { createClient } from '@/lib/supabase/client'

interface AppHeaderProps {
  today: DateKey | null
  email: string
  canReset: boolean
  onReset: () => void
}

export function AppHeader({ today, email, canReset, onReset }: AppHeaderProps) {
  const router = useRouter()

  const handleSignOut = async () => {
    await createClient().auth.signOut()
    router.push('/auth/login')
    router.refresh()
  }

  return (
    <header className="border-b border-border bg-background/80 backdrop-blur supports-backdrop-filter:bg-background/70">
      <div className="mx-auto flex w-full max-w-5xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
        <div className="flex items-center gap-3">
          <span
            aria-hidden="true"
            className="flex size-9 items-center justify-center rounded-xl bg-success text-success-foreground shadow-sm"
          >
            <Check className="size-5" strokeWidth={3} />
          </span>
          <div className="flex flex-col">
            <span className="text-sm font-semibold leading-tight">Tick 25</span>
            <span className="text-xs leading-tight text-muted-foreground">
              {today ? (
                <time dateTime={today}>{formatLongDate(today)}</time>
              ) : (
                'Loading date…'
              )}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <span className="hidden max-w-48 truncate pr-2 text-sm text-muted-foreground md:inline">
            {email}
          </span>
          {canReset && (
            <Button variant="ghost" size="lg" onClick={onReset} className="text-muted-foreground">
              <RotateCcw aria-hidden="true" />
              <span>Reset</span>
            </Button>
          )}
          <Button
            variant="ghost"
            size="lg"
            onClick={handleSignOut}
            className="text-muted-foreground"
            aria-label="Sign out"
          >
            <LogOut aria-hidden="true" />
            <span className="hidden sm:inline">Sign out</span>
          </Button>
        </div>
      </div>
    </header>
  )
}
