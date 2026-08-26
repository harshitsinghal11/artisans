import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { uploadFileToStorage } from '@/src/lib/supabase/storage'
import { createClient } from '@/src/lib/supabase/client'
import { useProductStore } from '@/src/hooks/useProductStore'

export type SubmitStatus = 'idle' | 'uploading_media' | 'saving_db' | 'processing_ai'

export function useSubmitProduct() {
  const router = useRouter()
  const [status, setStatus] = useState<SubmitStatus>('idle')
  const [error, setError] = useState<string | null>(null)
  const { imageFile, audioFile, materialCost, category, reset } = useProductStore()

  const submitProduct = async () => {
    if (!imageFile || !audioFile || materialCost === null || !category) {
      setError("Please fill out all fields.")
      return
    }

    setStatus('uploading_media')
    setError(null)

    try {
      // 1. Upload Image
      const { url: imageUrl, error: imageError } = await uploadFileToStorage('product-images', imageFile, 'jpg')
      if (imageError || !imageUrl) throw new Error("Failed to upload image")

      // 2. Upload Audio
      const { url: audioUrl, error: audioError } = await uploadFileToStorage('product-audio', audioFile, 'webm')
      if (audioError || !audioUrl) throw new Error("Failed to upload audio")

      // 3. Insert into Database
      setStatus('saving_db')
      const supabase = createClient()
      const { data: userData, error: authError } = await supabase.auth.getUser()
      if (authError || !userData.user) throw new Error("Authentication error")

      const { data: newProduct, error: dbError } = await supabase
        .from('products')
        .insert({
          user_id: userData.user.id,
          raw_image_url: imageUrl,
          raw_audio_url: audioUrl,
          category,
          material_cost: materialCost,
          status: 'processing'
        })
        .select()
        .single()

      if (dbError || !newProduct) throw dbError || new Error("Failed to insert product")

      // 4. Trigger AI Processing Pipeline
      setStatus('processing_ai')
      const processRes = await fetch('/api/process-product', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId: newProduct.id })
      });

      if (!processRes.ok) {
        console.error("AI Processing failed:", await processRes.text());
        reset()
        router.push('/dashboard?error=processing-failed')
        return
      }

      // Success
      setStatus('idle')
      reset()
      router.push(`/dashboard/review/${newProduct.id}`)
      
    } catch (err: any) {
      console.error(err)
      setError(err.message || "An error occurred while uploading. Please try again.")
      setStatus('idle')
    }
  }

  return { submitProduct, status, error }
}
