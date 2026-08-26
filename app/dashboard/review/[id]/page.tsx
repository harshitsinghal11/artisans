import { redirect } from 'next/navigation'
import { createClient } from '@/src/lib/supabase/server'
import { ReviewForm } from '@/src/components/features/ReviewForm'
import { AlertTriangle } from 'lucide-react'
import { Button } from '@/src/components/ui/Button'
import Link from 'next/link'

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function ReviewPage({ params }: PageProps) {
  const supabase = await createClient()

  // Ensure the user is authenticated
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    redirect('/auth/login')
  }

  const { id } = await params;
  const { data: product, error } = await supabase
    .from('products')
    .select('*')
    .eq('id', id) // 3. Use the unwrapped id here
    .eq('user_id', user.id)
    .single();

  if (error || !product) {
    return (
      <div className="flex flex-col items-center justify-center h-screen px-4 text-center space-y-4">
        <AlertTriangle className="w-12 h-12 text-destructive" />
        <h2 className="text-xl font-bold text-foreground">Product Not Found</h2>
        <p className="text-muted-foreground text-sm">We couldn't find this product, or you don't have permission to view it.</p>
        <Link href="/dashboard">
          <Button variant="outline">Back to Dashboard</Button>
        </Link>
      </div>
    )
  }

  // If the product is still processing, we shouldn't be here yet
  if (product.status === 'processing') {
    return (
      <div className="flex flex-col items-center justify-center h-screen px-4 text-center space-y-4">
        <h2 className="text-xl font-bold text-foreground">Still Processing...</h2>
        <p className="text-muted-foreground text-sm">The AI is still working its magic on your product. Please check back in a few seconds.</p>
        <Link href="/dashboard">
          <Button variant="outline">Back to Dashboard</Button>
        </Link>
      </div>
    )
  }

  return <ReviewForm product={product} />
}
