import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { getErrorMessage } from '@/src/lib/errors'
import { publishProductAction } from '@/src/actions/publish'

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
      await publishProductAction(productId, data)
      router.push('/dashboard?success=product-published')
    } catch (error: unknown) {
      console.error(error)
      setError(getErrorMessage(error, 'Failed to publish. Please try again.'))
      setIsPublishing(false)
    }
  }

  return { publish, isPublishing, error }
}
