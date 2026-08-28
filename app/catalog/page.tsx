import Image from 'next/image'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { Card } from '@/src/components/ui/Card'
import { CatalogList } from '@/src/components/features/CatalogList'
import { createClient, getUserAndProfile } from '@/src/lib/supabase/server'
import { getDictionary } from '@/src/lib/i18n'
import { ROUTES } from '@/src/lib/navigation'
import { cookies } from 'next/headers'
import { Language } from '@/src/lib/i18n/dictionaries'

interface CatalogProduct {
  id: string
  category: string | null
  suggested_price: number | null
  enhanced_image_url: string | null
  description_en: string | null
  description_hi: string | null
}

export default async function CatalogPage() {
  const supabase = await createClient()
  const t = await getDictionary()

  const cookieStore = await cookies()
  const lang = (cookieStore.get('NEXT_LOCALE')?.value || 'en') as Language

  const { user, profile } = await getUserAndProfile()
  if (!user) redirect('/auth/login')
  if (!profile?.role) redirect('/setup')
  if (profile?.role === 'customer') redirect('/feed')

  const { data: products, error } = await supabase
    .from('products')
    .select('id, category, suggested_price, enhanced_image_url, description_en, description_hi')
    .eq('user_id', user.id)
    .eq('status', 'published')
    .order('created_at', { ascending: false })

  if (error) {
    return (
      <div className="mx-auto w-full max-w-md px-4 py-6 text-center">
        <p className="text-destructive">Failed to load catalog.</p>
      </div>
    )
  }

  const typedProducts = (products as CatalogProduct[] | null) ?? []

  return (
    <div className="mx-auto w-full max-w-md px-4 py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">{t.myCatalog}</h1>
        <p className="text-sm text-muted-foreground">
          {typedProducts.length} {t.productsListed}
        </p>
      </div>

      {typedProducts.length === 0 ? (
        <Card className="mt-12 border-2 border-dashed p-8 text-center">
          <p className="mb-4 text-sm text-muted-foreground">{t.catalogEmpty}</p>
          <Link href={ROUTES.ADD_PRODUCT} className="text-sm font-medium text-primary">
            {t.addFirstProduct}
          </Link>
        </Card>
      ) : (
        <CatalogList products={typedProducts} lang={lang} />
      )}
    </div>
  )
}
