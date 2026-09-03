import { redirect } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { createClient, getUserAndProfile } from '@/src/lib/supabase/server'
import { EditProductForm } from '@/src/components/features/EditProductForm'
import { type Product } from '@/src/components/features/ProductGrid'

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params
  const productId = resolvedParams.id
  
  const { user } = await getUserAndProfile()
  
  if (!user) {
    redirect('/auth/login')
  }

  const supabase = await createClient()
  
  const { data: product, error } = await supabase
    .from('products')
    .select('id, category, suggested_price, description_en, description_hi, enhanced_image_url')
    .eq('id', productId)
    .eq('user_id', user.id)
    .single()

  if (error || !product) {
    redirect('/dashboard')
  }

  return (
    <div className="mx-auto w-full max-w-md px-4 py-6 pb-24">
      <div className="mb-6 flex items-center gap-3">
        <Link
          href="/dashboard"
          className="flex h-10 w-10 items-center justify-center rounded-full bg-muted/50 text-foreground transition-colors hover:bg-muted"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <h1 className="text-2xl font-bold text-foreground">Edit Product</h1>
      </div>

      <EditProductForm product={product as Product} />
    </div>
  )
}
