import { Check } from 'lucide-react'
import type { ReactNode } from 'react'

interface AuthShellProps {
  title: string
  description: string
  children: ReactNode
  footer?: ReactNode
}

export function AuthShell({ title, description, children, footer }: AuthShellProps) {
  return (
    <main className="flex min-h-dvh items-center justify-center px-4 py-10">
      <div className="flex w-full max-w-sm flex-col gap-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
        <div className="flex items-center gap-3">
          <span
            aria-hidden="true"
            className="flex size-9 items-center justify-center rounded-xl bg-success text-success-foreground shadow-sm"
          >
            <Check className="size-5" strokeWidth={3} />
          </span>
          <span className="text-sm font-semibold">Tick 25</span>
        </div>

        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-semibold tracking-tight text-balance">{title}</h1>
          <p className="leading-relaxed text-muted-foreground text-pretty">{description}</p>
        </div>

        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">{children}</div>

        {footer && <div className="text-center text-sm text-muted-foreground">{footer}</div>}
      </div>
    </main>
  )
}
