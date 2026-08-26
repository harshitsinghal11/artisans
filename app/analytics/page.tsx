import { createClient } from '@/src/lib/supabase/server'
import { redirect } from 'next/navigation'
import { getDictionary } from '@/src/lib/i18n'
import { AnalyticsDashboard } from '@/src/components/features/AnalyticsDashboard'

export default async function AnalyticsPage() {
  const supabase = await createClient()
  const t = await getDictionary()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const { data: products } = await supabase
    .from('products')
    .select('id, category, suggested_price')
    .eq('user_id', user.id)
    .eq('status', 'published')

  return (
    <div className="container mx-auto px-4 pt-6 pb-24 max-w-md">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">{t.analytics}</h1>
        <p className="text-sm text-muted-foreground">{t.insightsPerformance}</p>
      </div>

      <AnalyticsDashboard products={products || []} t={t} />
    </div>
  )
}
