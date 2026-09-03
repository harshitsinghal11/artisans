import { redirect } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { getUserAndProfile } from '@/src/lib/supabase/server'
import { ProfileForm } from '@/src/components/features/ProfileForm'
import { getDictionary } from '@/src/lib/i18n'
import { cookies } from 'next/headers'
import type { Language } from '@/src/lib/i18n/dictionaries'

export default async function ProfilePage() {
  const { user, profile } = await getUserAndProfile()

  if (!user || !profile) {
    redirect('/auth/login')
  }

  const cookieStore = await cookies()
  const lang = (cookieStore.get('NEXT_LOCALE')?.value as Language) || 'en'
  const t = await getDictionary()

  // Ensure role is correctly typed for the form
  const role = profile.role as 'artisan' | 'customer' | 'b2b'

  const initialData = {
    name: profile.name || '',
    phone_number: profile.phone_number || '',
    address: profile.address || '',
    specialised_in: profile.specialised_in || '',
    company_name: profile.company_name || '',
  }

  return (
    <div className="mx-auto w-full px-4 py-6 pb-24">
      <div className="mb-6 flex items-center gap-3">
        <Link
          href="/more"
          className="flex h-10 w-10 items-center justify-center rounded-full bg-muted/50 text-foreground transition-colors hover:bg-muted"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <h1 className="text-2xl font-bold text-foreground">Edit Profile</h1>
      </div>

      <div className="mb-6 rounded-2xl border border-border bg-card p-6 text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-xl font-bold text-primary uppercase">
          {initialData.name ? initialData.name.charAt(0) : user.email?.charAt(0)}
        </div>
        <p className="text-sm font-medium text-foreground">{user.email}</p>
        <span className="mt-2 inline-block rounded-full bg-muted px-3 py-1 text-xs font-semibold capitalize text-muted-foreground">
          {role}
        </span>
      </div>

      <ProfileForm initialData={initialData} role={role} />
    </div>
  )
}
