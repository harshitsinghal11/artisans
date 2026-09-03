import { redirect } from 'next/navigation'
import { getUserAndProfile } from '@/src/lib/supabase/server'
import SetupClient from './SetupClient'

export default async function SetupPage() {
  const { user, profile } = await getUserAndProfile()

  if (!user) {
    redirect('/auth/login')
  }

  // If the user already has a role, they shouldn't be able to change it freely
  if (profile?.role) {
    if (profile.role === 'artisan') {
      redirect('/dashboard')
    } else {
      redirect('/feed')
    }
  }

  return <SetupClient />
}
