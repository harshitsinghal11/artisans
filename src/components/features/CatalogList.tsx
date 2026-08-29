'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import { Trash2, Loader2 } from 'lucide-react'
import { Card, CardContent } from "@/src/components/ui/Card"
import { type Language, dictionaries, getCategoryName } from '@/src/lib/i18n/dictionaries'

export interface CatalogProduct {
  id: string
  category: string | null
  suggested_price: number | null
  enhanced_image_url: string | null
  description_en: string | null
  description_hi: string | null
}

interface CatalogListProps {
  products: CatalogProduct[]
  lang: Language
}

export function CatalogList({ products, lang }: CatalogListProps) {
  const [localProducts, setLocalProducts] = useState(products)
  const [selectedProduct, setSelectedProduct] = useState<CatalogProduct | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const t = dictionaries[lang]

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
    try {
      setIsDeleting(true)
      const res = await fetch('/api/delete-product', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId })
      })
      if (res.ok) {
        setLocalProducts(prev => prev.filter(p => p.id !== productId))
        setSelectedProduct(null)
      } else {
        console.error('Failed to delete product')
      }
    } catch (err) {
      console.error(err)
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-2">
        {localProducts.map((product, index) => (
          <Card
            key={product.id}
            className="overflow-hidden flex flex-col cursor-pointer transition-transform hover:scale-[1.01]"
            onClick={() => setSelectedProduct(product)}
          >
            <div className="relative mb-2 aspect-square w-full bg-muted">
              {product.enhanced_image_url ? (
                <Image
                  src={product.enhanced_image_url}
                  alt={product.category ?? 'Artisan product'}
                  fill
                  sizes="(max-width: 640px) 100vw, 33vw"
                  className="object-cover"
                  priority={index < 4}
                />
              ) : (
                <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
                  Image unavailable
                </div>
              )}
            </div>
            <CardContent className="flex flex-1 flex-col p-4">
              <div className="flex items-start justify-between gap-3">
                <h2 className="text-lg font-semibold text-foreground">
                  {getCategoryName(product.category, t)}
                </h2>
                <span className="text-lg font-bold text-primary">
                  ₹{product.suggested_price ?? 0}
                </span>
              </div>
              <p className="mt-2 text-sm text-muted-foreground line-clamp-2">
                {lang === 'hi' ? product.description_hi : product.description_en}
              </p>
            </CardContent>
          </Card>
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
              className="relative w-full max-h-[90vh] max-w-lg overflow-y-auto rounded-xl bg-card"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setSelectedProduct(null)}
                className="absolute right-4 top-4 z-10 rounded-full bg-black/50 p-2 text-white backdrop-blur-md transition-colors hover:bg-black/70"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
              </button>

              <div className="relative aspect-square w-full bg-muted">
                {selectedProduct.enhanced_image_url ? (
                  <Image
                    src={selectedProduct.enhanced_image_url}
                    alt={selectedProduct.category ?? 'Artisan product'}
                    fill
                    sizes="(max-width: 640px) 100vw"
                    className="object-cover"
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
                
                <div className="mt-8 flex justify-end">
                  <button
                    onClick={() => handleDelete(selectedProduct.id)}
                    disabled={isDeleting}
                    className="flex items-center gap-2 rounded-lg bg-destructive/10 px-4 py-2 text-sm font-medium text-destructive transition-colors hover:bg-destructive/20 disabled:opacity-50"
                  >
                    {isDeleting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                    Delete Product
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
