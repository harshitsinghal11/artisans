import { redirect } from 'next/navigation'
import { getUserAndProfile } from '@/src/lib/supabase/server'
import { ProfileForm } from '@/src/components/features/ProfileForm'

export default async function ArtisanSetupPage() {
  const { user, profile } = await getUserAndProfile()

  if (!user) {
    redirect('/auth/login')
  }
  
  if (profile?.role !== 'artisan') {
    redirect('/setup')
  }

  const initialData = {
    name: profile.name || '',
    phone_number: profile.phone_number || '',
    address: profile.address || '',
    specialised_in: profile.specialised_in || '',
    company_name: profile.company_name || '',
  }

  return (
    <div className="flex min-h-[100svh] items-center justify-center bg-background px-4 py-12 overflow-hidden">
      <div className="w-full max-w-md space-y-8">
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-bold text-foreground">Complete Your Artisan Profile</h1>
          <p className="text-sm text-muted-foreground">
            Please provide your details so customers can learn more about you.
          </p>
        </div>
        
        <div className="mb-6 rounded-2xl border border-border bg-card p-6 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-xl font-bold text-primary uppercase">
            {initialData.name ? initialData.name.charAt(0) : user.email?.charAt(0)}
          </div>
          <p className="text-sm font-medium text-foreground">{user.email}</p>
        </div>

        <ProfileForm initialData={initialData} role="artisan" redirectTo="/dashboard" />
      </div>
    </div>
  )
}
