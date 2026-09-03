import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft, Store } from 'lucide-react'
import { redirect } from 'next/navigation'
import { createClient, getUserAndProfile } from '@/src/lib/supabase/server'
import { dictionaries, getCategoryName } from '@/src/lib/i18n/dictionaries'
import { cookies } from 'next/headers'
import type { Language, Dictionary } from '@/src/lib/i18n/dictionaries'
import { ProductActions } from '@/src/components/features/ProductActions'

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params
  const productId = resolvedParams.id

  const supabase = await createClient()
  const cookieStore = await cookies()
  const lang = (cookieStore.get('NEXT_LOCALE')?.value === 'hi' ? 'hi' : 'en') as Language
  const t = dictionaries[lang]

  const { user, profile } = await getUserAndProfile()
  if (!user) redirect('/auth/login')
  if (!profile?.role) redirect('/setup')

  const fetchProduct = async () => {
    const { data, error } = await supabase
      .from('products')
      .select(`
        id, category, title_en, title_hi, suggested_price, description_en, description_hi, enhanced_image_url, user_id,
        profiles:user_id (name, company_name, specialised_in, address)
      `)
      .eq('id', productId)
      .single()

    if (error) throw error
    return data
  }

  let product: any = null
  let error = null
  try {
    const { getOrSetCache } = await import('@/src/lib/redis')
    product = await getOrSetCache(`product:${productId}`, fetchProduct, 600)
  } catch (err) {
    error = err
  }

  if (error || !product) {
    redirect('/feed')
  }

  const artisan = Array.isArray(product.profiles) ? product.profiles[0] : product.profiles
  const description = lang === 'hi' ? product.description_hi : product.description_en
  const categoryName = getCategoryName(product.category, t)

  return (
    <div className="mx-auto w-full pb-36">
      <div className="sticky top-0 z-10 flex items-center bg-background/80 p-4 backdrop-blur-md">
        <Link
          href="/feed"
          className="flex h-10 w-10 items-center justify-center rounded-full bg-muted/50 text-foreground transition-colors hover:bg-muted"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
      </div>

      <div className="px-4">
        <div className="relative aspect-square w-full overflow-hidden rounded-3xl bg-muted">
          {product.enhanced_image_url ? (
            <Image
              src={product.enhanced_image_url}
              alt={categoryName}
              fill
              className="object-cover"
              priority
            />
          ) : (
            <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
              Image unavailable
            </div>
          )}
        </div>

        <div className="mt-6 space-y-2">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-foreground">
                {(lang === 'hi' ? product.title_hi : product.title_en) || categoryName}
              </h1>
              {((lang === 'hi' ? product.title_hi : product.title_en) != null) && (
                <p className="mt-1 text-sm font-medium text-muted-foreground uppercase tracking-wider">
                  {categoryName}
                </p>
              )}
            </div>
            <span className="text-3xl font-bold text-primary">₹{product.suggested_price ?? 0}</span>
          </div>
        </div>

        <div className="mt-6 flex items-center gap-3 rounded-2xl border border-border bg-card p-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
            <Store className="h-6 w-6" />
          </div>
          <div className="flex-1 overflow-hidden">
            <h3 className="truncate font-semibold text-foreground">
              {artisan?.company_name || artisan?.name || 'Unknown Artisan'}
            </h3>
            <p className="truncate text-xs text-muted-foreground">
              {artisan?.specialised_in ? `Specialises in ${artisan.specialised_in}` : 'Verified Artisan'}
            </p>
          </div>
        </div>

        <div className="mt-8">
          <h2 className="mb-3 text-lg font-semibold text-foreground uppercase tracking-wider">Description</h2>
          <p className="whitespace-pre-wrap leading-relaxed text-muted-foreground">
            {description}
          </p>
        </div>
      </div>

      <div className="fixed bottom-16 left-0 right-0 z-40 bg-background/80 backdrop-blur-md border-t border-border p-4 sm:static sm:bg-transparent sm:border-0 sm:backdrop-blur-none sm:p-0 sm:mt-8">
        <ProductActions
          productId={product.id}
          price={product.suggested_price ?? 0}
          name={(lang === 'hi' ? product.title_hi : product.title_en) || categoryName}
          imageUrl={product.enhanced_image_url}
          userRole={profile.role}
        />
      </div>
    </div>
  )
}
