'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { AuthShell } from '@/components/auth/auth-shell'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { createClient } from '@/lib/supabase/client'

function signUpErrorMessage(error: unknown): string {
  const { code, status } = (error ?? {}) as { code?: string; status?: number }
  if (code === 'weak_password') return 'Please choose a stronger password.'
  if (code === 'email_address_invalid') {
    return 'Please use a real email address. Example and test domains are not supported.'
  }
  if (code === 'email_address_not_authorized') {
    return 'We cannot send a confirmation email to that address. Please use a different one.'
  }
  if (code === 'validation_failed') return 'Please check the details you entered.'
  if (code === 'over_email_send_rate_limit' || status === 429) {
    return 'Too many attempts. Please wait a moment and try again.'
  }
  return 'Unable to complete sign-up. Please try again.'
}

export default function SignUpPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [repeatPassword, setRepeatPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleSignUp = async (event: React.FormEvent) => {
    event.preventDefault()
    setError(null)
    if (password !== repeatPassword) {
      setError('Passwords do not match.')
      return
    }
    setIsLoading(true)
    try {
      const { error } = await createClient().auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo:
            process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL ??
            `${window.location.origin}/auth/callback`,
        },
      })
      if (error) throw error
      router.push('/auth/sign-up-success')
    } catch (error: unknown) {
      console.error('Sign-up error:', error)
      setError(signUpErrorMessage(error))
      setIsLoading(false)
    }
  }

  return (
    <AuthShell
      title="Create your account"
      description="Sign up to save your 25-day challenge and pick it up on any device."
      footer={
        <>
          {'Already have an account? '}
          <Link href="/auth/login" className="font-medium text-foreground underline underline-offset-4">
            Log in
          </Link>
        </>
      }
    >
      <form onSubmit={handleSignUp} className="flex flex-col gap-5">
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
            autoComplete="new-password"
            minLength={6}
            required
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="repeat-password">Repeat password</Label>
          <Input
            id="repeat-password"
            type="password"
            autoComplete="new-password"
            minLength={6}
            required
            value={repeatPassword}
            onChange={(event) => setRepeatPassword(event.target.value)}
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
          {isLoading ? 'Creating account…' : 'Sign up'}
        </Button>
      </form>
    </AuthShell>
  )
}
