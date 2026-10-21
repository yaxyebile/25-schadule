'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { AuthShell } from '@/components/auth/auth-shell'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { createClient } from '@/lib/supabase/client'

// Only the credential/existence signal is genericized; errors the user can act
// on are passed through.
function loginErrorMessage(error: unknown): string {
  const { code, status } = (error ?? {}) as { code?: string; status?: number }
  if (code === 'email_not_confirmed') {
    return 'Please confirm your email address. Check your inbox for the link.'
  }
  if (code === 'over_request_rate_limit' || status === 429) {
    return 'Too many attempts. Please wait a moment and try again.'
  }
  if (code === 'invalid_credentials') return 'Invalid email or password.'
  return 'Something went wrong. Please try again.'
}

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault()
    setIsLoading(true)
    setError(null)
    try {
      const { error } = await createClient().auth.signInWithPassword({ email, password })
      if (error) throw error
      router.push('/')
      router.refresh()
    } catch (error: unknown) {
      console.error('Login error:', error)
      setError(loginErrorMessage(error))
      setIsLoading(false)
    }
  }

  return (
    <AuthShell
      title="Welcome back"
      description="Log in to keep your streak going. Your progress syncs across every device."
      footer={
        <>
          {"Don't have an account? "}
          <Link href="/auth/sign-up" className="font-medium text-foreground underline underline-offset-4">
            Sign up
          </Link>
        </>
      }
    >
      <form onSubmit={handleLogin} className="flex flex-col gap-5">
        <div className="flex flex-col gap-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            autoComplete="email"
            placeholder="you@email.com"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            autoComplete="current-password"
            required
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
        </div>
        {error && (
          <p role="alert" className="text-sm text-missed">
            {error}
          </p>
        )}
        <Button
          type="submit"
          disabled={isLoading}
          className="h-11 w-full rounded-xl bg-success text-success-foreground hover:bg-success/90"
        >
          {isLoading ? 'Logging in…' : 'Log in'}
        </Button>
      </form>
    </AuthShell>
  )
}
