'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import { Card, CardContent } from "@/src/components/ui/Card"
import { type Dictionary, type Language, getCategoryName } from '@/src/lib/i18n/dictionaries'

interface Product {
  id: string
  category: string | null
  suggested_price: number | null
  enhanced_image_url: string | null
  description_en: string | null
  description_hi: string | null
  user_id: string
}

interface FeedListProps {
  products: Product[]
  t: Dictionary
  lang: Language
}

export function FeedList({ products, t, lang }: FeedListProps) {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)

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

  if (products.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-border bg-card p-8 text-center">
        <p className="text-muted-foreground">{t.noProductsYet}</p>
      </div>
    )
  }

  return (
    <>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-2">
        {products.map((product, index) => (
          <Card
            key={product.id}
            className="overflow-hidden cursor-pointer transition-transform hover:scale-[1.01]"
            onClick={() => setSelectedProduct(product)}
          >
            <div className="relative mb-2 aspect-square w-full bg-muted">
              {product.enhanced_image_url ? (
                <Image
                  src={product.enhanced_image_url}
                  alt={product.category ?? 'Artisan product'}
                  fill
                  sizes="(max-width: 640px) 100vw, 50vw"
                  className="object-cover"
                  priority={index < 2}
                />
              ) : (
                <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
                  Image unavailable
                </div>
              )}
            </div>
            <CardContent className="p-4">
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
                    className="object-contain" // Changed from object-none
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
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
