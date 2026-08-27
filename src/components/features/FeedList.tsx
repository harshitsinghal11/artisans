'use client'

import { Card, CardContent, CardHeader } from "@/src/components/ui/Card"
import { useState, useEffect } from 'react'

interface Product {
  id: string
  category: string
  suggested_price: number
  enhanced_image_url: string
  description_en: string
  description_hi: string
  user_id: string
}

interface FeedListProps {
  products: Product[]
  t: any // dictionary
  lang: 'en' | 'hi'
}

export function FeedList({ products, t, lang }: FeedListProps) {
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  if (!mounted) return null

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-6">
        {products.length > 0 ? (
          products.map((product) => (
            <Card key={product.id} className="overflow-hidden border-border bg-card shadow-sm">
              <div className="aspect-square w-full relative bg-muted">
                <img 
                  src={product.enhanced_image_url} 
                  alt={product.category}
                  className="w-full h-full object-cover"
                />
              </div>
              <CardContent className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold text-lg text-foreground">
                    {product.category} Item
                  </h3>
                  <span className="font-bold text-primary text-lg">
                    ₹{product.suggested_price}
                  </span>
                </div>
                <p className="text-muted-foreground text-sm line-clamp-2">
                  {lang === 'hi' ? product.description_hi : product.description_en}
                </p>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center p-8 text-center bg-card rounded-2xl border border-dashed border-border">
            <p className="text-muted-foreground">{t.noProductsYet}</p>
          </div>
        )}
      </div>
    </div>
  )
}
