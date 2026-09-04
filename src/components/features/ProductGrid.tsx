'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Trash2, Loader2, Edit, X } from 'lucide-react'
import { Card, CardContent } from "@/src/components/ui/Card"
import { type Dictionary, type Language, getCategoryName } from '@/src/lib/i18n/dictionaries'

export interface Product {
  id: string
  category: string | null
  title_en?: string | null
  title_hi?: string | null
  suggested_price: number | null
  enhanced_image_url: string | null
  description_en: string | null
  description_hi: string | null
  user_id?: string
  profiles?: {
    name: string | null
    company_name: string | null
    address: string | null
  } | any
}

interface ProductGridProps {
  products: Product[]
  t: Dictionary
  lang: Language
  onDelete?: (productId: string) => Promise<boolean>
  hrefPrefix?: string
}

export function ProductGrid({ products, t, lang, onDelete, hrefPrefix }: ProductGridProps) {
  const router = useRouter()
  const [localProducts, setLocalProducts] = useState<Product[]>([])
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    setLocalProducts(products)
  }, [products])

  // Reset selected product when language changes
  useEffect(() => {
    if (selectedProduct) {
      const updatedProduct = localProducts.find(p => p.id === selectedProduct.id)
      if (updatedProduct) {
        setSelectedProduct(updatedProduct)
      }
    }
  }, [lang, localProducts, selectedProduct])

  const handleDelete = async (productId: string) => {
    if (!onDelete || !confirm('Are you sure you want to delete this product?')) return

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
      <Card className="border-2 border-dashed rounded-md p-8 text-center shadow-none">
        <p className="text-sm text-muted-foreground">{t.noProductsYet || 'No products found.'}</p>
      </Card>
    )
  }

  return (
    <>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {localProducts.map((product, index) => {
          const artisan = product.profiles;

          return (
            <div
              key={product.id}
              className="cursor-pointer group h-full"
              onClick={() => handleProductClick(product)}
            >
              <Card className="overflow-hidden h-full flex flex-col rounded-md shadow-sm transition-colors border-border group-hover:border-primary/50">
                <div className="relative mb-2 aspect-square w-full bg-muted shrink-0 border-b border-border">
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
                <CardContent className="p-4 flex flex-col flex-1">
                  <div className="flex items-start justify-between gap-3">
                    <h2 className="text-sm font-semibold text-foreground line-clamp-1 group-hover:text-primary transition-colors">
                      {(lang === 'hi' ? product.title_hi : product.title_en) || getCategoryName(product.category, t)}
                    </h2>
                    <span className="text-sm font-bold text-primary whitespace-nowrap">
                      ₹{product.suggested_price ?? 0}
                    </span>
                  </div>
                  {((lang === 'hi' ? product.title_hi : product.title_en) != null) && (
                    <p className="mt-1 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      {getCategoryName(product.category, t)}
                    </p>
                  )}

                </CardContent>
              </Card>
            </div>
          )
        })}
      </div>

      {selectedProduct && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
          onClick={() => setSelectedProduct(null)}
        >
          <div
            className="relative w-full max-h-[90vh] max-w-lg overflow-y-auto bg-card border border-border rounded-md shadow-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedProduct(null)}
              className="absolute right-4 top-4 z-10 flex h-8 w-8 items-center justify-center rounded-md bg-black/50 text-white transition-colors hover:bg-black/70"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="relative aspect-square w-full bg-muted border-b border-border">
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
                <div>
                  <h2 className="text-2xl font-bold tracking-tight text-foreground">
                    {(lang === 'hi' ? selectedProduct.title_hi : selectedProduct.title_en) || getCategoryName(selectedProduct.category, t)}
                  </h2>
                  {((lang === 'hi' ? selectedProduct.title_hi : selectedProduct.title_en) != null) && (
                    <p className="mt-1 text-sm font-medium text-muted-foreground uppercase tracking-wider">
                      {getCategoryName(selectedProduct.category, t)}
                    </p>
                  )}
                </div>
                <span className="text-2xl font-bold text-primary whitespace-nowrap">
                  ₹{selectedProduct.suggested_price ?? 0}
                </span>
              </div>

              <div className="pt-4">
                <span className="mb-2 block text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                  Description
                </span>
                <p className="whitespace-pre-wrap text-base leading-relaxed text-foreground">
                  {lang === 'hi' ? selectedProduct.description_hi : selectedProduct.description_en}
                </p>
              </div>

              {onDelete && (
                <div className="mt-8 flex justify-end gap-3 pt-4 border-t border-border">
                  <Link
                    href={`/edit-product/${selectedProduct.id}`}
                    className="inline-flex items-center gap-2 rounded-md border border-border bg-transparent px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted"
                  >
                    <Edit className="h-4 w-4" />
                    Edit Product
                  </Link>
                  <button
                    onClick={() => handleDelete(selectedProduct.id)}
                    disabled={isDeleting}
                    className="inline-flex items-center gap-2 rounded-md border border-destructive bg-destructive/10 px-4 py-2 text-sm font-medium text-destructive transition-colors hover:bg-destructive/20 disabled:opacity-50"
                  >
                    {isDeleting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                    Delete Product
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
