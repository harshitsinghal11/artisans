import { getUserAndProfile } from '@/src/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function AddProductLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user, profile } = await getUserAndProfile()
  if (!user) redirect('/auth/login')

  if (!profile?.role) redirect('/setup')
  if (profile?.role === 'customer') redirect('/feed')

  return <>{children}</>
}
