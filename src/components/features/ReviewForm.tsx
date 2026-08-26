'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/src/components/ui/Button'
import { Input } from '@/src/components/ui/Input'
import { Check, Edit3, ChevronDown, ChevronUp } from 'lucide-react'
import { Loader } from '@/src/components/ui/Loader'
import { usePublishProduct } from '@/src/hooks/usePublishProduct'

interface ReviewFormProps {
  product: {
    id: string
    enhanced_image_url: string
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

  // Editable State
  const [price, setPrice] = useState(product.suggested_price)
  const [descEn, setDescEn] = useState(product.description_en)
  const [descHi, setDescHi] = useState(product.description_hi)

  const { publish, isPublishing, error } = usePublishProduct(product.id)

  const handlePublish = async () => {
    await publish({
      suggested_price: price,
      description_en: descEn,
      description_hi: descHi
    })
  }

  return (
    <div className="flex flex-col w-full max-w-md mx-auto bg-background min-h-screen pb-24">

      {/* Hero Image */}
      <div className="relative w-full aspect-square bg-muted">
        {product.enhanced_image_url ? (
          <img
            src={product.enhanced_image_url}
            alt="Enhanced Product"
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-muted-foreground">
            Image missing
          </div>
        )}
        <div className="absolute top-4 left-4 bg-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded-full shadow">
          {product.category}
        </div>
      </div>

      <div className="p-4 space-y-6">
        {error && (
          <div className="p-3 bg-destructive/10 text-destructive text-sm rounded-lg border border-destructive/20 text-center">
            {error}
          </div>
        )}

        {/* Pricing Section */}
        <div className="space-y-4 bg-card p-5 rounded-2xl border border-border shadow-sm">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-foreground">Selling Price (₹)</h3>
            <Edit3 className="w-4 h-4 text-muted-foreground" />
          </div>

          <Input
            type="number"
            value={price}
            onChange={(e) => setPrice(Number(e.target.value))}
            className="text-2xl font-bold h-14"
          />

          {/* AI Reasoning Accordion */}
          <div className="border border-border rounded-xl overflow-hidden">
            <button
              onClick={() => setShowReasoning(!showReasoning)}
              className="w-full flex items-center justify-between p-3 bg-muted/50 text-sm font-medium text-foreground transition-colors hover:bg-muted"
            >
              <div className="flex items-center gap-2">
                <span className="text-primary text-lg leading-none">✨</span>
                AI Pricing Breakdown
              </div>
              {showReasoning ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>

            {showReasoning && (
              <div className="p-4 bg-background text-sm space-y-3">
                <div className="flex justify-between border-b border-border pb-2">
                  <span className="text-muted-foreground">Raw Material Cost:</span>
                  <span className="font-semibold">₹{product.material_cost}</span>
                </div>
                <p className="text-muted-foreground leading-relaxed">
                  {product.price_reasoning}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Description Section */}
        <div className="space-y-4">
          <div className="flex bg-muted p-1 rounded-xl">
            <button
              onClick={() => setActiveTab('hi')}
              className={`flex-1 py-2 text-sm font-medium rounded-lg transition-colors ${activeTab === 'hi' ? 'bg-background shadow text-foreground' : 'text-muted-foreground'}`}
            >
              हिंदी
            </button>
            <button
              onClick={() => setActiveTab('en')}
              className={`flex-1 py-2 text-sm font-medium rounded-lg transition-colors ${activeTab === 'en' ? 'bg-background shadow text-foreground' : 'text-muted-foreground'}`}
            >
              English
            </button>
          </div>

          <div className="relative">
            <textarea
              value={activeTab === 'hi' ? descHi : descEn}
              onChange={(e) => activeTab === 'hi' ? setDescHi(e.target.value) : setDescEn(e.target.value)}
              className="w-full min-h-[160px] p-4 rounded-2xl border border-border bg-card text-foreground text-sm leading-relaxed focus:ring-2 focus:ring-primary focus:border-transparent resize-y"
            />
            <Edit3 className="absolute top-4 right-4 w-4 h-4 text-muted-foreground/50 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Fixed Bottom Action */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-background border-t border-border sm:relative sm:border-0 sm:bg-transparent">
        <Button
          onClick={handlePublish}
          disabled={isPublishing || !price}
          className="w-full h-14 rounded-full text-base font-semibold shadow-lg gap-2"
        >
          {isPublishing ? <Loader className="w-6 h-6 text-primary-foreground" /> : (
            <>
              <Check className="w-5 h-5" /> Publish to Catalog
            </>
          )}
        </Button>
      </div>
    </div>
  )
}
