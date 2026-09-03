'use client'

import { motion, AnimatePresence } from 'framer-motion'
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
      <AnimatePresence mode="wait">
        {!isInCart ? (
          <motion.div
            key="add-to-cart"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="flex-1"
          >
            <Button 
              onClick={handleAddToCart}
              className="w-full gap-2 rounded-xl h-12"
            >
              <ShoppingCart className="h-5 w-5" />
              Add to Cart
            </Button>
          </motion.div>
        ) : (
          <motion.div
            key="quantity"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="flex-1 flex items-center justify-between overflow-hidden rounded-xl border border-primary bg-primary/5 h-12 px-2"
          >
            <button 
              onClick={handleDecrease}
              className="flex h-10 w-10 items-center justify-center text-primary transition-colors hover:bg-primary/10 rounded-lg"
            >
              <Minus className="h-4 w-4" />
            </button>
            <div className="flex flex-1 flex-col items-center justify-center">
              <span className="text-sm font-bold text-foreground leading-none">{quantity}</span>
              {userRole === 'b2b' && <span className="text-[10px] text-muted-foreground mt-0.5 leading-none">MOQ: 50</span>}
            </div>
            <button 
              onClick={handleIncrease}
              disabled={quantity >= maxQty}
              className="flex h-10 w-10 items-center justify-center text-primary transition-colors hover:bg-primary/10 rounded-lg disabled:opacity-50"
            >
              <Plus className="h-4 w-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
      <button
        onClick={() => toggleItem(productId)}
        className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border transition-colors ${
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
