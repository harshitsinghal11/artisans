import { createClient } from '@/src/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Card } from '@/src/components/ui/Card'
import { getDictionary } from '@/src/lib/i18n'

export default async function CatalogPage() {
  const supabase = await createClient()
  const t = await getDictionary()

  // Ensure user is authenticated
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  // Fetch all published products
  const { data: products, error } = await supabase
    .from('products')
    .select('*')
    .eq('user_id', user.id)
    .eq('status', 'published')
    .order('created_at', { ascending: false })

  if (error) {
    return (
      <div className="container mx-auto px-4 pt-6 pb-24 text-center">
        <p className="text-destructive">Failed to load catalog.</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 pt-6 pb-24 max-w-md">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">{t.myCatalog}</h1>
        <p className="text-sm text-muted-foreground">{products.length} {t.productsListed}</p>
      </div>

      {products.length === 0 ? (
        <Card className="p-8 text-center border-dashed border-2 mt-12">
          <p className="text-muted-foreground text-sm mb-4">{t.catalogEmpty}</p>
          <Link href="/add-product" className="text-primary font-medium text-sm bg-primary/10 px-4 py-2 rounded-full">
            {t.addFirstProduct}
          </Link>
        </Card>
      ) : (
        <div className="grid grid-cols-2 gap-3">
          {products.map(product => (
            <div key={product.id} className="bg-card rounded-2xl overflow-hidden border border-border shadow-sm flex flex-col">
              <div className="aspect-square bg-muted relative">
                <img
                  src={product.enhanced_image_url}
                  alt="Product Image"
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-2 left-2 bg-background/80 backdrop-blur-sm text-xs px-2 py-1 rounded-md font-medium shadow-sm">
                  {product.category}
                </div>
              </div>
              <div className="p-3 flex flex-col flex-1">
                <p className="text-sm font-semibold text-foreground line-clamp-2 leading-tight flex-1">
                  {product.description_en}
                </p>
                <p className="text-primary font-bold mt-2">
                  ₹{product.suggested_price}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
