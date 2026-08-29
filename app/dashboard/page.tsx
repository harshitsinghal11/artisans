import Image from 'next/image'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { Card, CardContent, CardHeader } from "@/src/components/ui/Card"
import { createClient, getUserAndProfile } from '@/src/lib/supabase/server'
import { ROUTES } from '@/src/lib/navigation'
import { getDictionary } from '@/src/lib/i18n'
import { cookies } from 'next/headers'
import type { Dictionary, Language } from '@/src/lib/i18n/dictionaries'
import { getCategoryName } from '@/src/lib/i18n/dictionaries'

interface DashboardProduct {
  id: string
  category: string | null
  description_en: string | null
  description_hi: string | null
  enhanced_image_url: string | null
  suggested_price: number | null
}



export default async function DashboardPage() {
  const supabase = await createClient()
  const t = await getDictionary()

  const cookieStore = await cookies()
  const lang = (cookieStore.get('NEXT_LOCALE')?.value || 'en') as Language

  const { user, profile } = await getUserAndProfile()
  if (!user) redirect('/auth/login')
  if (!profile?.role) redirect('/setup')
  if (profile?.role === 'customer') redirect('/feed')

  // Fetch the current user's published products
  const { data: products } = await supabase
    .from('products')
    .select('id, category, description_en, description_hi, enhanced_image_url, suggested_price')
    .eq('user_id', user.id)
    .eq('status', 'published')
    .order('created_at', { ascending: false })

  // Fetch the total count of all published items on the platform
  const { count: itemsListed } = await supabase
    .from('products')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'published')

  const typedProducts = (products as DashboardProduct[] | null) ?? []
  const recentProducts = typedProducts.slice(0, 3)

  return (
    <div className="mx-auto w-full max-w-md px-4 py-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground">{t.welcome}</h1>
        <p className="text-sm text-muted-foreground">{user.email}</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <h2 className="font-medium text-foreground">{t.published}</h2>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-foreground">{typedProducts.length}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <h2 className="font-medium text-foreground">{t.itemsListed}</h2>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-foreground">{itemsListed}</p>
          </CardContent>
        </Card>
      </div>

      <section className="mt-8">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-foreground">{t.recentProducts}</h2>
          {typedProducts.length > 0 ? (
            <Link href={ROUTES.CATALOG} className="text-sm font-medium text-primary">
              {t.viewAll}
            </Link>
          ) : null}
        </div>

        {recentProducts.length > 0 ? (
          <div className="space-y-4">
            {recentProducts.map((product, index) => (
              <div key={product.id} className="flex items-center gap-4 rounded-2xl border border-border bg-card p-3">
                <div className="relative h-16 w-16 overflow-hidden rounded-xl bg-muted">
                  {product.enhanced_image_url ? (
                    <Image
                      src={product.enhanced_image_url}
                      alt={product.category ?? 'Product image'}
                      fill
                      sizes="64px"
                      className="object-cover"
                      priority={index === 0}
                    />
                  ) : null}
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="truncate text-sm font-semibold text-foreground">
                    {getCategoryName(product.category, t)}
                  </h3>
                  <p className="mt-1 line-clamp-1 text-xs text-muted-foreground">
                    {(lang === 'hi' ? product.description_hi : product.description_en) || t.noProductsYet}
                  </p>
                </div>
                <div className="font-bold text-primary">₹{product.suggested_price ?? 0}</div>
              </div>
            ))}
          </div>
        ) : (
          <Card className="border-2 border-dashed p-8 text-center">
            <p className="mb-4 text-sm text-muted-foreground">{t.noProducts}</p>
            <Link href={ROUTES.ADD_PRODUCT} className="text-sm font-medium text-primary">
              {t.addFirstProduct}
            </Link>
          </Card>
        )}
      </section>
    </div>
  )
}
