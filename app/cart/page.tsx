import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { CartView } from '@/src/components/features/CartView'

export default function CartPage() {
  return (
    <div className="mx-auto w-full max-w-md px-4 py-6 pb-24">
      <div className="mb-6 flex items-center gap-3">
        <Link
          href="/feed"
          className="flex h-10 w-10 items-center justify-center rounded-full bg-muted/50 text-foreground transition-colors hover:bg-muted"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <h1 className="text-2xl font-bold text-foreground">Your Cart</h1>
      </div>

      <CartView />
    </div>
  )
}
