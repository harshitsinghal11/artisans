import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/src/lib/supabase/client'
import { useProductStore } from '@/src/hooks/useProductStore'
import { getErrorMessage } from '@/src/lib/errors'
import { removeFileFromStorage, uploadFileToStorage } from '@/src/lib/supabase/storage'

export type SubmitStatus = 'idle' | 'uploading_media' | 'saving_db' | 'processing_ai'

export function useSubmitProduct() {
  const router = useRouter()
  const [status, setStatus] = useState<SubmitStatus>('idle')
  const [error, setError] = useState<string | null>(null)
  const { imageFile, audioFile, materialCost, category, textDescription, removeBackground, reset } = useProductStore()

  const submitProduct = async () => {
    if (!imageFile || (!audioFile && !textDescription) || materialCost === null || !category) {
      setError('Please fill out all fields.')
      return
    }

    setStatus('uploading_media')
    setError(null)

    let imagePath: string | null = null
    let audioPath: string | null = null

    try {
      const supabase = createClient()
      const { data: userData, error: authError } = await supabase.auth.getUser()
      if (authError || !userData.user) {
        throw new Error('Authentication error')
      }

      const imageUpload = await uploadFileToStorage('product-images', imageFile, 'jpg')
      imagePath = imageUpload.path
      if (imageUpload.error || !imageUpload.url) {
        throw new Error('Failed to upload image')
      }

      let audioUpload: any = null
      if (audioFile) {
        audioUpload = await uploadFileToStorage('product-audio', audioFile, 'webm')
        audioPath = audioUpload.path
        if (audioUpload.error || !audioUpload.url) {
          throw new Error('Failed to upload audio')
        }
      }

      setStatus('saving_db')

      const { data: newProduct, error: dbError } = await supabase
        .from('products')
        .insert({
          user_id: userData.user.id,
          raw_image_url: imageUpload.url,
          raw_audio_url: audioUpload?.url || null,
          transcript: textDescription || null,
          category,
          material_cost: materialCost,
          status: 'processing',
        })
        .select()
        .single()

      if (dbError || !newProduct) {
        throw dbError ?? new Error('Failed to insert product')
      }

      setStatus('processing_ai')

      const processResponse = await fetch('/api/process-product', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId: newProduct.id, removeBackground }),
      })

      if (!processResponse.ok) {
        const errorBody = await processResponse.json().catch(() => null)
        throw new Error(errorBody?.error ?? 'AI processing failed.')
      }

      setStatus('idle')
      reset()
      router.push(`/dashboard/review/${newProduct.id}`)
    } catch (error: unknown) {
      if (imagePath) {
        void removeFileFromStorage('product-images', imagePath).catch(() => undefined)
      }

      if (audioPath) {
        void removeFileFromStorage('product-audio', audioPath).catch(() => undefined)
      }

      console.error(error)
      setError(getErrorMessage(error, 'An error occurred while uploading. Please try again.'))
      setStatus('idle')
    }
  }

  return { submitProduct, status, error }
}
