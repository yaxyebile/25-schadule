import { redirect } from 'next/navigation'
import { TrackerApp } from '@/components/tracker/tracker-app'
import { createClient } from '@/lib/supabase/server'

export default async function Page() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/auth/login')

  return <TrackerApp userId={user.id} email={user.email ?? ''} />
}
