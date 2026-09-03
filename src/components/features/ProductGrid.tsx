'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Trash2, Loader2, Edit } from 'lucide-react'
import { Card, CardContent } from "@/src/components/ui/Card"
import { MicroAnimation } from "@/src/components/ui/MicroAnimation"
import { type Dictionary, type Language, getCategoryName } from '@/src/lib/i18n/dictionaries'

export interface Product {
  id: string
  category: string | null
  suggested_price: number | null
  enhanced_image_url: string | null
  description_en: string | null
  description_hi: string | null
  user_id?: string
}

interface ProductGridProps {
  products: Product[]
  t: Dictionary
  lang: Language
  // If provided, the delete button will be shown in the modal
  onDelete?: (productId: string) => Promise<boolean>
  // If provided, clicking a product navigates to `${hrefPrefix}/${id}`
  hrefPrefix?: string
}

export function ProductGrid({ products, t, lang, onDelete, hrefPrefix }: ProductGridProps) {
  const [localProducts, setLocalProducts] = useState(products)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const router = useRouter()

  useEffect(() => {
    setLocalProducts(products)
  }, [products])

  useEffect(() => {
    if (selectedProduct) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [selectedProduct])

  const handleDelete = async (productId: string) => {
    if (!onDelete) return
    
    try {
      setIsDeleting(true)
      const success = await onDelete(productId)
      if (success) {
        setLocalProducts(prev => prev.filter(p => p.id !== productId))
        setSelectedProduct(null)
      }
    } finally {
      setIsDeleting(false)
    }
  }

  const handleProductClick = (product: Product) => {
    if (hrefPrefix) {
      router.push(`${hrefPrefix}/${product.id}`)
    } else {
      setSelectedProduct(product)
    }
  }

  if (localProducts.length === 0) {
    return (
      <Card className="border-2 border-dashed rounded-none p-8 text-center">
        <p className="text-sm text-muted-foreground">{t.noProductsYet || 'No products found.'}</p>
      </Card>
    )
  }

  return (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-2">
        {localProducts.map((product, index) => (
          <MicroAnimation
            key={product.id}
            className="cursor-pointer"
            onClick={() => handleProductClick(product)}
          >
            <Card className="overflow-hidden h-full">
              <div className="relative mb-2 aspect-square w-full bg-muted">
                {product.enhanced_image_url ? (
                  <Image
                    src={product.enhanced_image_url}
                    alt={product.category ?? 'Product Image'}
                    fill
                    sizes="(max-width: 640px) 100vw, 50vw"
                    className="object-cover"
                    priority={index < 4}
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
                    Image unavailable
                  </div>
                )}
              </div>
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-3">
                  <h2 className="text-md font-semibold">
                    {getCategoryName(product.category, t)}
                  </h2>
                  <span className="text-md font-bold text-primary">
                    ₹{product.suggested_price ?? 0}
                  </span>
                </div>
                <p className="mt-2 text-sm text-muted-foreground line-clamp-2">
                  {lang === 'hi' ? product.description_hi : product.description_en}
                </p>
              </CardContent>
            </Card>
          </MicroAnimation>
        ))}
      </div>

      <AnimatePresence>
        {selectedProduct && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4"
            onClick={() => setSelectedProduct(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="relative w-full max-h-[90vh] max-w-lg overflow-y-auto bg-card border border-border"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setSelectedProduct(null)}
                className="absolute right-4 top-4 z-10 bg-black/50 p-2 text-white transition-colors hover:bg-black/70"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
              </button>

              <div className="relative aspect-square w-full bg-muted">
                {selectedProduct.enhanced_image_url ? (
                  <Image
                    src={selectedProduct.enhanced_image_url}
                    alt={selectedProduct.category ?? 'Product Image'}
                    fill
                    sizes="(max-width: 640px) 100vw"
                    className="object-contain"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
                    Image unavailable
                  </div>
                )}
              </div>

              <div className="p-6">
                <div className="flex items-start justify-between gap-4 border-b border-border pb-4">
                  <h2 className="text-2xl font-bold text-foreground">
                    {getCategoryName(selectedProduct.category, t)}
                  </h2>
                  <span className="text-2xl font-bold text-primary">
                    ₹{selectedProduct.suggested_price ?? 0}
                  </span>
                </div>
                <div className="pt-4">
                  <h3 className="mb-2 text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                    Description
                  </h3>
                  <p className="whitespace-pre-wrap text-base leading-relaxed text-foreground">
                    {lang === 'hi' ? selectedProduct.description_hi : selectedProduct.description_en}
                  </p>
                </div>

                {onDelete && (
                  <div className="mt-8 flex justify-end gap-3">
                    <Link
                      href={`/edit-product/${selectedProduct.id}`}
                      className="flex items-center gap-2 border border-border bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted"
                    >
                      <Edit className="h-4 w-4" />
                      Edit Product
                    </Link>
                    <button
                      onClick={() => handleDelete(selectedProduct.id)}
                      disabled={isDeleting}
                      className="flex items-center gap-2 border border-destructive bg-destructive/10 px-4 py-2 text-sm font-medium text-destructive transition-colors hover:bg-destructive/20 disabled:opacity-50"
                    >
                      {isDeleting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                      Delete Product
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
