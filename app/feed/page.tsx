import { createClient } from '@/src/lib/supabase/server'
import { redirect } from 'next/navigation'
import { getDictionary } from '@/src/lib/i18n'
import { FeedList } from '@/src/components/features/FeedList'
import { cookies } from 'next/headers'
import { Language } from '@/src/lib/i18n/dictionaries'
import { createClient as createSupabaseClient } from '@supabase/supabase-js'

export default async function FeedPage() {
  const supabase = await createClient()
  const t = await getDictionary()

  const cookieStore = await cookies()
  const lang = (cookieStore.get('NEXT_LOCALE')?.value || 'en') as Language

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  // Fetch all published products for the feed using service_role to bypass RLS
  const supabaseAdmin = createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  const { data: products, error } = await supabaseAdmin
    .from('products')
    .select('*')
    .eq('status', 'published')
    .order('created_at', { ascending: false })

  console.log('Feed fetch error:', error)
  console.log('Feed fetched products length:', products?.length)

  return (
    <div className="container mx-auto px-4 pt-6 pb-24 max-w-xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">{t.feed}</h1>
        <p className="text-sm text-muted-foreground">{t.feedDescription}</p>
      </div>

      <FeedList products={products || []} t={t} lang={lang} />
    </div>
  )
}
