import Image from 'next/image'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { Card } from '@/src/components/ui/Card'
import { CatalogGrid } from '@/src/components/features/CatalogGrid'
import { createClient, getUserAndProfile } from '@/src/lib/supabase/server'
import { getOrSetCache } from '@/src/lib/redis'
import { getDictionary } from '@/src/lib/i18n'
import { ROUTES } from '@/src/lib/navigation'
import { cookies } from 'next/headers'
import { Language } from '@/src/lib/i18n/dictionaries'

export default async function CatalogPage() {
  const supabase = await createClient()
  const t = await getDictionary()

  const cookieStore = await cookies()
  const lang = (cookieStore.get('NEXT_LOCALE')?.value || 'en') as Language

  const { user, profile } = await getUserAndProfile()
  if (!user) redirect('/auth/login')
  if (!profile?.role) redirect('/setup')
  if (profile?.role === 'customer' || profile?.role === 'b2b') redirect('/feed')


  const fetchCatalogProducts = async () => {
    const { data, error } = await supabase
      .from('products')
      .select('id, category, suggested_price, enhanced_image_url, description_en, description_hi')
      .eq('user_id', user.id)
      .eq('status', 'published')
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data
  }

  let products: any[] | null = []
  let error = null
  try {
    products = await getOrSetCache(`catalog:products:${user.id}`, fetchCatalogProducts, 600)
  } catch (err) {
    error = err
  }

  if (error) {
    return (
      <div className="mx-auto w-full max-w-md px-4 text-center">
        <p className="text-destructive">Failed to load catalog.</p>
      </div>
    )
  }

  const typedProducts = products ?? []

  return (
    <div className="mx-auto w-full max-w-md px-4 py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">{t.myCatalog}</h1>
        <p className="text-sm text-muted-foreground">
          {typedProducts.length} {t.productsListed}
        </p>
      </div>

      <CatalogGrid 
        products={typedProducts} 
        t={t} 
        lang={lang}
      />
    </div>
  )
}
