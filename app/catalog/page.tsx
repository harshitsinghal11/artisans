import Image from 'next/image'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { Card } from '@/src/components/ui/Card'
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
    .select('id, category, suggested_price, enhanced_image_url, description_en')
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
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {typedProducts.map((product) => (
            <article key={product.id} className="flex flex-col overflow-hidden rounded-2xl border border-border bg-card">
              <div className="relative aspect-square bg-muted">
                {product.enhanced_image_url ? (
                  <Image
                    src={product.enhanced_image_url}
                    alt={product.category ?? 'Product image'}
                    fill
                    sizes="(max-width: 640px) 100vw, 50vw"
                    className="object-cover"
                  />
                ) : null}
                <div className="absolute left-2 top-2 rounded-md bg-background px-2 py-1 text-xs font-medium text-foreground">
                  {product.category ?? 'Handmade'}
                </div>
              </div>
              <div className="flex flex-1 flex-col p-3">
                <p className="flex-1 text-sm font-semibold leading-tight text-foreground line-clamp-2">
                  {product.description_en ?? 'No description available yet.'}
                </p>
                <p className="mt-2 font-bold text-primary">₹{product.suggested_price ?? 0}</p>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  )
}
