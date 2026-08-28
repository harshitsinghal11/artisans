import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/src/lib/supabase/client'
import { getErrorMessage } from '@/src/lib/errors'

interface PublishData {
  suggested_price: number
  description_en: string
  description_hi: string
}

export function usePublishProduct(productId: string) {
  const router = useRouter()
  const [isPublishing, setIsPublishing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const publish = async (data: PublishData) => {
    setIsPublishing(true)
    setError(null)

    try {
      const supabase = createClient()
      const { error: dbError } = await supabase
        .from('products')
        .update({
          suggested_price: data.suggested_price,
          description_en: data.description_en,
          description_hi: data.description_hi,
          status: 'published',
        })
        .eq('id', productId)

      if (dbError) {
        throw dbError
      }

      router.push('/dashboard?success=product-published')
    } catch (error: unknown) {
      console.error(error)
      setError(getErrorMessage(error, 'Failed to publish. Please try again.'))
      setIsPublishing(false)
    }
  }

  return { publish, isPublishing, error }
}
