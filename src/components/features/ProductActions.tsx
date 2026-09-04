'use client'

import { useState, useEffect } from 'react'
import { ShoppingCart, Heart, Minus, Plus } from 'lucide-react'
import { useCartStore } from '@/src/hooks/useCartStore'
import { useWishlistStore } from '@/src/hooks/useWishlistStore'
import { Button } from '@/src/components/ui/Button'

interface ProductActionsProps {
  productId: string
  price: number
  name: string
  imageUrl: string | null
  userRole: 'customer' | 'b2b' | 'artisan' | null
}

export function ProductActions({ productId, price, name, imageUrl, userRole }: ProductActionsProps) {
  const { addItem, removeItem, updateQuantity, items } = useCartStore()
  const { toggleItem, hasItem } = useWishlistStore()
  
  const minQty = userRole === 'b2b' ? 50 : 1
  const maxQty = userRole === 'b2b' ? Infinity : 10
  
  const cartItem = items.find(i => i.productId === productId)
  const isInCart = !!cartItem
  const quantity = cartItem?.quantity || minQty
  const isWishlisted = hasItem(productId)

  const [inputValue, setInputValue] = useState<string>(quantity.toString())

  useEffect(() => {
    setInputValue(quantity.toString())
  }, [quantity])

  const handleDecrease = () => {
    if (quantity > minQty) {
      updateQuantity(productId, quantity - 1)
    } else {
      removeItem(productId)
    }
  }

  const handleIncrease = () => {
    if (quantity < maxQty) {
      updateQuantity(productId, quantity + 1)
    }
  }

  const handleAddToCart = () => {
    addItem({
      productId,
      name,
      price,
      quantity: minQty,
      imageUrl
    })
  }

  return (
    <div className="flex gap-4 w-full">
      {/* Actions */}
      <div className="flex-1">
        {!isInCart ? (
          <Button 
            onClick={handleAddToCart}
            className="w-full gap-2 rounded-md h-12"
          >
            <ShoppingCart className="h-5 w-5" />
            Add to Cart
          </Button>
        ) : (
          <div className="flex w-full items-center justify-between overflow-hidden rounded-md border border-primary bg-primary/5 h-12 px-2">
            <button 
              onClick={handleDecrease}
              className="flex h-10 w-10 items-center justify-center text-primary transition-colors hover:bg-primary/10 rounded-md"
            >
              <Minus className="h-4 w-4" />
            </button>
            <div className="flex flex-1 flex-col items-center justify-center">
              <input
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                value={inputValue}
                onChange={(e) => {
                  const val = e.target.value;
                  setInputValue(val);
                  const num = parseInt(val, 10);
                  if (!isNaN(num) && num >= minQty && num <= maxQty) {
                    updateQuantity(productId, num);
                  }
                }}
                onBlur={() => {
                  const num = parseInt(inputValue, 10);
                  if (isNaN(num) || num < minQty) {
                    updateQuantity(productId, minQty);
                    setInputValue(minQty.toString());
                  } else if (num > maxQty) {
                    updateQuantity(productId, maxQty);
                    setInputValue(maxQty.toString());
                  }
                }}
                className="w-full text-center text-sm font-bold text-foreground leading-none bg-transparent outline-none"
              />
            </div>
            <button 
              onClick={handleIncrease}
              disabled={quantity >= maxQty}
              className="flex h-10 w-10 items-center justify-center text-primary transition-colors hover:bg-primary/10 rounded-md disabled:opacity-50"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>
      <button
        onClick={() => toggleItem(productId)}
        className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-md border transition-colors ${
          isWishlisted 
            ? 'border-primary bg-primary/10 text-primary' 
            : 'border-border bg-card text-muted-foreground hover:bg-muted'
        }`}
      >
        <Heart className={`h-5 w-5 ${isWishlisted ? 'fill-primary' : ''}`} />
      </button>
    </div>
  )
}
