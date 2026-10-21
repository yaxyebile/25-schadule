import Link from 'next/link'
import { AuthShell } from '@/components/auth/auth-shell'

export default function AuthErrorPage() {
  return (
    <AuthShell
      title="Something went wrong"
      description="That sign-in link is invalid or has expired."
      footer={
        <Link href="/auth/login" className="font-medium text-foreground underline underline-offset-4">
          Back to log in
        </Link>
      }
    >
      <p className="text-sm leading-relaxed text-muted-foreground">
        Try logging in again, or sign up once more to get a fresh confirmation link.
      </p>
    </AuthShell>
  )
}
