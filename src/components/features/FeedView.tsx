'use client'

import { useState, useMemo } from 'react'
import { Search } from './Search'
import { ProductGrid, type Product } from './ProductGrid'
import { type Dictionary, type Language } from '@/src/lib/i18n/dictionaries'

interface FeedViewProps {
  products: Product[]
  t: Dictionary
  lang: Language
}

export function FeedView({ products, t, lang }: FeedViewProps) {
  const [searchQuery, setSearchQuery] = useState('')

  const filteredProducts = useMemo(() => {
    if (!searchQuery.trim()) return products

    const query = searchQuery.toLowerCase()
    return products.filter(p => {
      const cat = p.category?.toLowerCase() || ''
      const descEn = p.description_en?.toLowerCase() || ''
      const descHi = p.description_hi?.toLowerCase() || ''
      return cat.includes(query) || descEn.includes(query) || descHi.includes(query)
    })
  }, [products, searchQuery])

  return (
    <div className="space-y-6">
      <Search value={searchQuery} onChange={setSearchQuery} />

      {filteredProducts.length === 0 ? (
        <div className="rounded-2xl border border-dashed p-8 text-center">
          <p className="text-sm text-muted-foreground">No products found matching "{searchQuery}"</p>
        </div>
      ) : (
        <ProductGrid products={filteredProducts} t={t} lang={lang} hrefPrefix="/product" />
      )}
    </div>
  )
}
