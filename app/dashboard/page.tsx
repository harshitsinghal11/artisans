import { createClient } from '@/src/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Card, CardContent, CardHeader } from "@/src/components/ui/Card"
import Link from 'next/link'
import { ROUTES } from '@/src/lib/navigation'
import { getDictionary } from '@/src/lib/i18n'

export default async function DashboardPage() {
  const supabase = await createClient()
  const t = await getDictionary()

  // Get user
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  // Fetch published products
  const { data: products } = await supabase
    .from('products')
    .select('*')
    .eq('user_id', user.id)
    .eq('status', 'published')
    .order('created_at', { ascending: false })

  const publishedCount = products?.length || 0
  const recentProducts = products?.slice(0, 3) || []

  return (
    <div className="container mx-auto px-4 pt-6 pb-24 max-w-md">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-foreground">{t.welcome}</h1>
          <p className="text-sm text-muted-foreground">{user.email}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Card className="bg-card border-primary/10">
          <CardHeader className="pb-2">
            <h3 className="font-medium text-foreground">{t.published}</h3>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-foreground">{publishedCount}</p>
          </CardContent>
        </Card>

        <Card className="bg-card border-primary/10">
          <CardHeader className="pb-2">
            <h3 className="font-medium text-foreground">{t.analytics}</h3>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-foreground">0</p>
          </CardContent>
        </Card>
      </div>

      <div className="mt-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-foreground">{t.recentProducts}</h2>
          {publishedCount > 0 && (
            <Link href={ROUTES.CATALOG} className="text-sm text-primary font-medium">
              {t.viewAll}
            </Link>
          )}
        </div>

        {recentProducts.length > 0 ? (
          <div className="space-y-4">
            {recentProducts.map(product => (
              <div key={product.id} className="flex items-center gap-4 bg-card p-3 rounded-2xl border border-border shadow-sm">
                <img
                  src={product.enhanced_image_url}
                  alt="product"
                  className="w-16 h-16 rounded-xl object-cover bg-muted"
                />
                <div className="flex-1">
                  <h4 className="font-semibold text-foreground text-sm line-clamp-1">{product.category} Item</h4>
                  <p className="text-xs text-muted-foreground mt-1 line-clamp-1">{product.description_en}</p>
                </div>
                <div className="font-bold text-primary">
                  ₹{product.suggested_price}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <Card className="p-8 text-center border-dashed border-2">
            <p className="text-muted-foreground text-sm mb-4">{t.noProducts}</p>
            <Link href="/add-product" className="text-primary font-medium text-sm bg-primary/10 px-4 py-2 rounded-full">
              {t.addFirstProduct}
            </Link>
          </Card>
        )}
      </div>
    </div>
  )
}
