import Image from 'next/image'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { Card, CardContent, CardHeader } from "@/src/components/ui/Card"
import { createClient, getUserAndProfile } from '@/src/lib/supabase/server'
import { getOrSetCache } from '@/src/lib/redis'
import { ROUTES } from '@/src/lib/navigation'
import { getDictionary } from '@/src/lib/i18n'
import { cookies } from 'next/headers'
import type { Dictionary, Language } from '@/src/lib/i18n/dictionaries'
import { getCategoryName } from '@/src/lib/i18n/dictionaries'
import { Package, BarChart, Plus, Layers, Settings, ChevronRight } from 'lucide-react'

interface DashboardProduct {
  id: string
  category: string | null
  title_en: string | null
  title_hi: string | null
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
  if (profile?.role === 'customer' || profile?.role === 'b2b') redirect('/feed')
  if (profile?.role === 'artisan' && (!profile.name || !profile.phone_number)) redirect('/setup/artisan')


  const fetchAllPublishedProducts = async () => {
    const { data, error } = await supabase
      .from('products')
      .select('id, category, title_en, title_hi, description_en, description_hi, enhanced_image_url, suggested_price')
      .eq('status', 'published')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching products:', error.message)
      return null
    }

    return data
  }

  // Fetch the total count of all published items on the platform
  const fetchTotalPublished = async () => {
    const { count } = await supabase
      .from('products')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'published')
    return count
  }

  const [products, itemsListed] = await Promise.all([
    getOrSetCache(`dashboard:products:${user.id}`, fetchAllPublishedProducts, 600),
    getOrSetCache('dashboard:totalPublished', fetchTotalPublished, 600)
  ])

  const typedProducts = (products as DashboardProduct[] | null) ?? []
  const recentProducts = typedProducts.slice(0, 3)

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-8">
      {/* Hero Section */}
      <div className="mb-8 border-b border-border pb-6 sm:flex sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">{t.welcome}, {profile.name?.split(' ')[0] || 'Artisan'}</h1>
        </div>
        <div className="mt-4 hidden sm:mt-0 sm:flex sm:items-center sm:gap-3">
          <Link href={ROUTES.ADD_PRODUCT} className="inline-flex h-9 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90">
            <Plus className="mr-2 h-4 w-4" />
            {t.addFirstProduct}
          </Link>
          <Link href={ROUTES.MORE} className="inline-flex h-9 items-center justify-center rounded-md border border-border bg-transparent px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted">
            <Settings className="mr-2 h-4 w-4" />
            Settings
          </Link>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 mb-10">
        <Card className="rounded-md shadow-none">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">{t.published}</h2>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-foreground">{typedProducts.length}</p>
          </CardContent>
        </Card>

        <Card className="rounded-md shadow-none">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">{t.itemsListed}</h2>
            <BarChart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-foreground">{itemsListed}</p>
          </CardContent>
        </Card>
      </div>

      {/* Mobile Quick Actions */}
      <div className="mb-10 grid grid-cols-2 gap-3 sm:hidden">
        <Link href={ROUTES.ADD_PRODUCT} className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90">
          <Plus className="mr-2 h-4 w-4" />
          Add Product
        </Link>
        <Link href={ROUTES.CATALOG} className="inline-flex h-10 items-center justify-center rounded-md border border-border bg-transparent px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted">
          <Layers className="mr-2 h-4 w-4" />
          Catalog
        </Link>
      </div>

      {/* Recent Products Table */}
      <section>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold tracking-tight text-foreground">{t.recentProducts}</h2>
          {typedProducts.length > 0 ? (
            <Link href={ROUTES.CATALOG} className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground">
              {t.viewAll}
              <ChevronRight className="ml-1 h-4 w-4" />
            </Link>
          ) : null}
        </div>

        {recentProducts.length > 0 ? (
          <div className="overflow-hidden rounded-md border border-border bg-card">
            <div className="divide-y divide-border">
              {recentProducts.map((product) => (
                <Link href={`/product/${product.id}`} key={product.id} className="flex items-center gap-4 p-4 transition-colors hover:bg-muted/50 group">
                  <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded bg-muted border border-border">
                    {product.enhanced_image_url ? (
                      <Image
                        src={product.enhanced_image_url}
                        alt={product.category ?? 'Product image'}
                        fill
                        sizes="48px"
                        className="object-cover"
                      />
                    ) : null}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="truncate text-sm font-medium text-foreground group-hover:text-primary transition-colors">
                      {(lang === 'hi' ? product.title_hi : product.title_en) || getCategoryName(product.category, t)}
                    </h3>
                    <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
                      <span className="uppercase tracking-wider">{getCategoryName(product.category, t)}</span>
                      <span className="hidden sm:inline">•</span>
                      <span className="truncate hidden sm:inline">{(lang === 'hi' ? product.description_hi : product.description_en) || 'No description'}</span>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="font-semibold text-foreground">₹{product.suggested_price ?? 0}</div>
                    <div className="text-xs text-success mt-0.5">Published</div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center rounded-md border border-dashed border-border py-12 text-center">
            <Package className="h-10 w-10 text-muted-foreground/50 mb-4" />
            <p className="text-sm text-muted-foreground mb-4">{t.noProducts}</p>
            <Link href={ROUTES.ADD_PRODUCT} className="inline-flex h-9 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow hover:bg-primary/90">
              <Plus className="mr-2 h-4 w-4" />
              {t.addFirstProduct}
            </Link>
          </div>
        )}
      </section>
    </div>
  )
}
