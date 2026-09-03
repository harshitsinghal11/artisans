'use client'

import { useRouter } from 'next/navigation'
import { ProductGrid, type Product } from './ProductGrid'
import { type Dictionary, type Language } from '@/src/lib/i18n/dictionaries'

interface CatalogGridProps {
  products: Product[]
  t: Dictionary
  lang: Language
}

export function CatalogGrid({ products, t, lang }: CatalogGridProps) {
  const router = useRouter()

  const handleDelete = async (productId: string) => {
    try {
      const res = await fetch('/api/delete-product', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId })
      })
      
      if (res.ok) {
        router.refresh()
        return true
      }
      return false
    } catch (err) {
      console.error(err)
      return false
    }
  }

  return <ProductGrid products={products} t={t} lang={lang} onDelete={handleDelete} />
}
