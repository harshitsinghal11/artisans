import Image from 'next/image'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { Card, CardContent, CardHeader } from "@/src/components/ui/Card"
import { createClient, getUserAndProfile } from '@/src/lib/supabase/server'
import { ROUTES } from '@/src/lib/navigation'
import { getDictionary } from '@/src/lib/i18n'

interface DashboardProduct {
  id: string
  category: string | null
  description_en: string | null
  enhanced_image_url: string | null
  suggested_price: number | null
}

export default async function DashboardPage() {
  const supabase = await createClient()
  const t = await getDictionary()

  const { user, profile } = await getUserAndProfile()
  if (!user) redirect('/auth/login')
  if (!profile?.role) redirect('/setup')
  if (profile?.role === 'customer') redirect('/feed')

  const { data: products } = await supabase
    .from('products')
    .select('id, category, description_en, enhanced_image_url, suggested_price')
    .eq('user_id', user.id)
    .eq('status', 'published')
    .order('created_at', { ascending: false })

  const typedProducts = (products as DashboardProduct[] | null) ?? []
  const recentProducts = typedProducts.slice(0, 3)

  return (
    <div className="mx-auto w-full max-w-md px-4 py-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground">{t.welcome}</h1>
        <p className="text-sm text-muted-foreground">{user.email}</p>
      </div>

      <div className="grid grid-cols-1 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <h2 className="font-medium text-foreground">{t.published}</h2>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-foreground">{typedProducts.length}</p>
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
            {recentProducts.map((product) => (
              <div key={product.id} className="flex items-center gap-4 rounded-2xl border border-border bg-card p-3">
                <div className="relative h-16 w-16 overflow-hidden rounded-xl bg-muted">
                  {product.enhanced_image_url ? (
                    <Image
                      src={product.enhanced_image_url}
                      alt={product.category ?? 'Product image'}
                      fill
                      sizes="64px"
                      className="object-cover"
                    />
                  ) : null}
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="truncate text-sm font-semibold text-foreground">
                    {product.category ?? 'Handmade item'}
                  </h3>
                  <p className="mt-1 line-clamp-1 text-xs text-muted-foreground">
                    {product.description_en ?? 'No description available yet.'}
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
