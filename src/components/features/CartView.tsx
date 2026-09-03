'use client'

import Image from 'next/image'
import Link from 'next/link'
import { ShoppingCart, Trash2, Minus, Plus } from 'lucide-react'
import { useCartStore } from '@/src/hooks/useCartStore'
import { Button } from '@/src/components/ui/Button'
import { ROUTES } from '@/src/lib/navigation'

export function CartView() {
  const { items, removeItem, updateQuantity, totalPrice, clearCart } = useCartStore()

  if (items.length === 0) {
    return (
      <div className="flex h-[60vh] flex-col items-center justify-center px-4 text-center">
        <div className="mb-4 rounded-full bg-muted p-6">
          <ShoppingCart className="h-12 w-12 text-muted-foreground" />
        </div>
        <h2 className="text-xl font-bold text-foreground">Your cart is empty</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Looks like you haven't added anything to your cart yet.
        </p>
        <Link href={ROUTES.FEED} className="mt-8">
          <Button>Start Shopping</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {items.map((item) => (
        <div key={item.productId} className="flex gap-4 rounded-2xl border border-border bg-card p-4">
          <div className="relative h-24 w-24 overflow-hidden rounded-xl bg-muted">
            {item.imageUrl ? (
              <Image src={item.imageUrl} alt={item.name} fill className="object-cover" />
            ) : null}
          </div>
          <div className="flex flex-1 flex-col justify-between">
            <div>
              <h3 className="font-semibold text-foreground">{item.name}</h3>
              <p className="font-bold text-primary">₹{item.price}</p>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center overflow-hidden rounded-xl border border-border">
                <button
                  onClick={() => updateQuantity(item.productId, Math.max(1, item.quantity - 1))}
                  className="flex h-8 w-8 items-center justify-center text-muted-foreground hover:bg-muted"
                >
                  <Minus className="h-3 w-3" />
                </button>
                <div className="flex h-8 w-10 items-center justify-center text-xs font-semibold">
                  {item.quantity}
                </div>
                <button
                  onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                  className="flex h-8 w-8 items-center justify-center text-muted-foreground hover:bg-muted"
                >
                  <Plus className="h-3 w-3" />
                </button>
              </div>
              <button
                onClick={() => removeItem(item.productId)}
                className="text-destructive hover:opacity-80"
              >
                <Trash2 className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      ))}

      <div className="mt-8 space-y-4 rounded-2xl bg-muted/50 p-6">
        <div className="flex items-center justify-between font-bold text-foreground">
          <span>Total</span>
          <span>₹{totalPrice()}</span>
        </div>
        <Button 
          className="w-full h-12 rounded-xl text-base"
          onClick={() => {
            alert('Checkout flow would start here!')
            clearCart()
          }}
        >
          Checkout
        </Button>
      </div>
    </div>
  )
}
