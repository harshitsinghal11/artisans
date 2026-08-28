import { createClient } from '@/src/lib/supabase/server'
import { redirect } from 'next/navigation'
import { getDictionary } from '@/src/lib/i18n'
import { FeedList } from '@/src/components/features/FeedList'
import { cookies } from 'next/headers'
import type { Language } from '@/src/lib/i18n/dictionaries'
import { getUserAndProfile } from '@/src/lib/supabase/server'

export interface FeedProduct {
  id: string
  category: string | null
  suggested_price: number | null
  enhanced_image_url: string | null
  description_en: string | null
  description_hi: string | null
  user_id: string
}

export default async function FeedPage() {
  const supabase = await createClient()
  const t = await getDictionary()
  const cookieStore = await cookies()
  const lang = (cookieStore.get('NEXT_LOCALE')?.value === 'hi' ? 'hi' : 'en') as Language

  const { user, profile } = await getUserAndProfile()

  if (!user) redirect('/auth/login')
  if (!profile?.role) redirect('/setup')

  const { data: products, error } = await supabase
    .from('products')
    .select('id, category, suggested_price, enhanced_image_url, description_en, description_hi, user_id')
    .eq('status', 'published')
    .order('created_at', { ascending: false })
    .range(0, 19)

  return (
    <div className="mx-auto w-full max-w-xl px-4 py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">{t.feed}</h1>
        <p className="text-sm text-muted-foreground">{t.feedDescription}</p>
        {error ? <p className="mt-2 text-sm text-destructive">{t.feedLoadError}</p> : null}
      </div>

      <FeedList products={(products as FeedProduct[] | null) ?? []} t={t} lang={lang} />
    </div>
  )
}
