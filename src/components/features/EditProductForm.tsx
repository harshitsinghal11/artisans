'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2 } from 'lucide-react'
import { updateProductAction } from '@/src/actions/product'
import { type Product } from '@/src/components/features/ProductGrid'

const CATEGORIES = ['Textiles', 'Pottery', 'Woodwork', 'Jewellery', 'Art', 'Other']

interface EditProductFormProps {
  product: Product
}

export function EditProductForm({ product }: EditProductFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const [formData, setFormData] = useState({
    category: product.category || 'Other',
    suggested_price: product.suggested_price?.toString() || '0',
    description_en: product.description_en || '',
    description_hi: product.description_hi || '',
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      await updateProductAction(product.id, {
        category: formData.category,
        suggested_price: parseFloat(formData.suggested_price) || 0,
        description_en: formData.description_en,
        description_hi: formData.description_hi,
      })
      router.push('/dashboard')
      router.refresh()
    } catch (err: any) {
      setError(err.message || 'Failed to update product')
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="rounded-xl border border-destructive/20 bg-destructive/10 p-3 text-sm text-destructive">
          {error}
        </div>
      )}

      <div className="space-y-4">
        <div>
          <label htmlFor="category" className="mb-2 block text-sm font-medium text-foreground">
            Category
          </label>
          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="w-full rounded-xl border border-border bg-card p-3 text-sm text-foreground focus:border-primary focus:outline-none"
            required
          >
            {CATEGORIES.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="suggested_price" className="mb-2 block text-sm font-medium text-foreground">
            Price (₹)
          </label>
          <input
            id="suggested_price"
            name="suggested_price"
            type="number"
            min="0"
            step="0.01"
            value={formData.suggested_price}
            onChange={handleChange}
            className="w-full rounded-xl border border-border bg-card p-3 text-sm text-foreground focus:border-primary focus:outline-none"
            required
          />
        </div>

        <div>
          <label htmlFor="description_en" className="mb-2 block text-sm font-medium text-foreground">
            Description (English)
          </label>
          <textarea
            id="description_en"
            name="description_en"
            value={formData.description_en}
            onChange={handleChange}
            rows={4}
            className="w-full rounded-xl border border-border bg-card p-3 text-sm text-foreground focus:border-primary focus:outline-none resize-none"
            required
          />
        </div>

        <div>
          <label htmlFor="description_hi" className="mb-2 block text-sm font-medium text-foreground">
            Description (Hindi)
          </label>
          <textarea
            id="description_hi"
            name="description_hi"
            value={formData.description_hi}
            onChange={handleChange}
            rows={4}
            className="w-full rounded-xl border border-border bg-card p-3 text-sm text-foreground focus:border-primary focus:outline-none resize-none"
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="flex w-full items-center justify-center rounded-xl bg-primary py-3 font-semibold text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50"
      >
        {loading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : null}
        Save Changes
      </button>
    </form>
  )
}
