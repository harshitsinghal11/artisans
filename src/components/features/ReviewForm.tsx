'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Check, ChevronDown, ChevronUp, Edit3 } from 'lucide-react'
import { Button } from '@/src/components/ui/Button'
import { Input } from '@/src/components/ui/Input'
import { Loader } from '@/src/components/ui/Loader'
import { usePublishProduct } from '@/src/hooks/usePublishProduct'

interface ReviewFormProps {
  product: {
    id: string
    enhanced_image_url: string | null
    description_en: string
    description_hi: string
    suggested_price: number
    price_reasoning: string
    material_cost: number
    category: string
  }
}

export function ReviewForm({ product }: ReviewFormProps) {
  const [activeTab, setActiveTab] = useState<'en' | 'hi'>('hi')
  const [showReasoning, setShowReasoning] = useState(false)
  const [price, setPrice] = useState(product.suggested_price.toString())
  const [descEn, setDescEn] = useState(product.description_en)
  const [descHi, setDescHi] = useState(product.description_hi)
  const { publish, isPublishing, error } = usePublishProduct(product.id)

  const parsedPrice = Number(price)
  const isPriceValid = Number.isFinite(parsedPrice) && parsedPrice > 0
  const isDescriptionValid = descEn.trim().length > 0 && descHi.trim().length > 0

  const handlePublish = async () => {
    if (!isPriceValid || !isDescriptionValid) {
      return
    }

    await publish({
      suggested_price: parsedPrice,
      description_en: descEn.trim(),
      description_hi: descHi.trim(),
    })
  }

  return (
    <div className="mx-auto flex min-h-[100svh] w-full max-w-md flex-col bg-background pb-28">
      <div className="relative aspect-square w-full bg-muted">
        {product.enhanced_image_url ? (
          <Image
            src={product.enhanced_image_url}
            alt={product.category}
            fill
            priority
            sizes="(max-width: 768px) 100vw, 448px"
            className="object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-muted-foreground">
            Image missing
          </div>
        )}
        <div className="absolute left-4 top-4 rounded-full bg-primary px-3 py-1 text-xs font-bold text-primary-foreground">
          {product.category}
        </div>
      </div>

      <div className="space-y-6 p-4">
        {error ? (
          <div className="rounded-2xl border border-destructive/20 bg-destructive/10 p-3 text-center text-sm text-destructive">
            {error}
          </div>
        ) : null}

        <section className="space-y-4 rounded-2xl border border-border bg-card p-5">
          <div className="flex items-center justify-between">
            <label htmlFor="selling-price" className="font-semibold text-foreground">
              Selling Price (₹)
            </label>
            <Edit3 className="h-4 w-4 text-muted-foreground" />
          </div>

          <Input
            id="selling-price"
            type="number"
            min="1"
            inputMode="numeric"
            value={price}
            onChange={(event) => setPrice(event.target.value)}
            className="h-14 text-2xl font-bold"
          />

          <div className="overflow-hidden rounded-xl border border-border">
            <button
              type="button"
              onClick={() => setShowReasoning((currentValue) => !currentValue)}
              className="flex w-full items-center justify-between bg-muted/50 p-3 text-sm font-medium text-foreground transition-colors hover:bg-muted"
            >
              <span>AI Pricing Breakdown</span>
              {showReasoning ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </button>

            {showReasoning ? (
              <div className="space-y-3 bg-background p-4 text-sm">
                <div className="flex justify-between border-b border-border pb-2">
                  <span className="text-muted-foreground">Raw Material Cost:</span>
                  <span className="font-semibold">₹{product.material_cost}</span>
                </div>
                <p className="leading-relaxed text-muted-foreground">{product.price_reasoning}</p>
              </div>
            ) : null}
          </div>
        </section>

        <section className="space-y-4">
          <div className="flex rounded-xl bg-muted p-1">
            <button
              type="button"
              onClick={() => setActiveTab('hi')}
              className={`flex-1 rounded-lg py-2 text-sm font-medium transition-colors ${
                activeTab === 'hi' ? 'bg-background text-foreground' : 'text-muted-foreground'
              }`}
            >
              हिंदी
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('en')}
              className={`flex-1 rounded-lg py-2 text-sm font-medium transition-colors ${
                activeTab === 'en' ? 'bg-background text-foreground' : 'text-muted-foreground'
              }`}
            >
              English
            </button>
          </div>

          <div className="relative">
            <label htmlFor="product-description" className="sr-only">
              Product description
            </label>
            <textarea
              id="product-description"
              value={activeTab === 'hi' ? descHi : descEn}
              onChange={(event) =>
                activeTab === 'hi' ? setDescHi(event.target.value) : setDescEn(event.target.value)
              }
              className="min-h-[160px] w-full resize-y rounded-2xl border border-border bg-card p-4 text-sm leading-relaxed text-foreground focus:border-transparent focus:ring-2 focus:ring-primary"
            />
            <Edit3 className="pointer-events-none absolute right-4 top-4 h-4 w-4 text-muted-foreground/50" />
          </div>
        </section>
      </div>

      <div className="sticky bottom-0 z-30 mt-auto border-t border-border bg-background p-4">
        <Button
          onClick={handlePublish}
          disabled={isPublishing || !isPriceValid || !isDescriptionValid}
          className="h-14 w-full gap-2 rounded-full text-base font-semibold"
        >
          {isPublishing ? (
            <Loader className="h-6 w-6 text-primary-foreground" />
          ) : (
            <>
              <Check className="h-5 w-5" /> Publish to Catalog
            </>
          )}
        </Button>
      </div>
    </div>
  )
}
