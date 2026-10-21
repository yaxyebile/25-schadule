import Link from 'next/link'
import { AuthShell } from '@/components/auth/auth-shell'

export default function SignUpSuccessPage() {
  return (
    <AuthShell
      title="Check your email"
      description="We sent you a confirmation link. Open it to activate your account, then start your challenge."
      footer={
        <Link href="/auth/login" className="font-medium text-foreground underline underline-offset-4">
          Back to log in
        </Link>
      }
    >
      <p className="text-sm leading-relaxed text-muted-foreground">
        {"Didn't get it? Check your spam folder, or wait a minute and try signing up again."}
      </p>
    </AuthShell>
  )
}
