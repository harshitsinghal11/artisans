import Link from 'next/link'
import { redirect } from 'next/navigation'
import { AlertTriangle } from 'lucide-react'
import { Button } from '@/src/components/ui/Button'
import { ReviewForm } from '@/src/components/features/ReviewForm'
import { createClient } from '@/src/lib/supabase/server'

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function ReviewPage({ params }: PageProps) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/login')
  }

  const { id } = await params
  const { data: product, error } = await supabase
    .from('products')
    .select('*')
    .eq('id', id)
    .eq('user_id', user.id)
    .single()

  if (error || !product) {
    return (
      <div className="flex min-h-[100svh] flex-col items-center justify-center space-y-4 px-4 text-center">
        <AlertTriangle className="h-12 w-12 text-destructive" />
        <h1 className="text-xl font-bold text-foreground">Product Not Found</h1>
        <p className="text-sm text-muted-foreground">
          We couldn&apos;t find this product, or you don&apos;t have permission to view it.
        </p>
        <Link href="/dashboard">
          <Button variant="outline">Back to Dashboard</Button>
        </Link>
      </div>
    )
  }

  if (product.status === 'processing') {
    return (
      <div className="flex min-h-[100svh] flex-col items-center justify-center space-y-4 px-4 text-center">
        <h1 className="text-xl font-bold text-foreground">Still Processing...</h1>
        <p className="text-sm text-muted-foreground">
          The AI is still working on your product. Please check back in a few seconds.
        </p>
        <Link href="/dashboard">
          <Button variant="outline">Back to Dashboard</Button>
        </Link>
      </div>
    )
  }

  return <ReviewForm product={product} />
}
