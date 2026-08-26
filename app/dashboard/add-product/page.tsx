'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { CameraCapture } from '@/src/components/features/CameraCapture'
import { VoiceRecorder } from '@/src/components/features/VoiceRecorder'
import { useProductStore, ProductCategory } from '@/src/store/useProductStore'
import { uploadFileToStorage } from '@/src/lib/supabase/storage'
import { createClient } from '@/src/lib/supabase/client'
import { Button } from '@/src/components/ui/Button'
import { Input } from '@/src/components/ui/input'
import { Loader } from '@/src/components/ui/loader'

const CATEGORIES: ProductCategory[] = ['Textiles', 'Pottery', 'Woodwork', 'Jewelry', 'Art', 'Other']

export default function AddProductPage() {
  const router = useRouter()
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1)
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const { 
    imageFile, audioFile, materialCost, category,
    setImage, setAudio, setCost, setCategory, reset
  } = useProductStore()

  const handleImageCapture = (file: File) => {
    setImage(file)
    setStep(2)
  }

  const handleAudioRecord = (file: File) => {
    setAudio(file)
    setStep(3)
  }

  const handleUploadAndSubmit = async () => {
    if (!imageFile || !audioFile || materialCost === null || !category) {
      setError("Please fill out all fields.")
      return
    }

    setIsUploading(true)
    setError(null)

    try {
      // 1. Upload Image
      const { url: imageUrl, error: imageError } = await uploadFileToStorage('product-images', imageFile, 'jpg')
      if (imageError || !imageUrl) throw new Error("Failed to upload image")

      // 2. Upload Audio
      const { url: audioUrl, error: audioError } = await uploadFileToStorage('product-audio', audioFile, 'webm')
      if (audioError || !audioUrl) throw new Error("Failed to upload audio")

      // 3. Insert into Database
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

      // 4. Trigger AI Processing Pipeline (Phase 3)
      // Note: In a production app, you might want this to happen via a background webhook,
      // but for a demo, waiting for it here is acceptable if latency is low.
      const processRes = await fetch('/api/process-product', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId: newProduct.id })
      });

      if (!processRes.ok) {
        console.error("AI Processing failed:", await processRes.text());
        // If it fails, go to dashboard so they aren't stuck on a broken review screen
        reset()
        router.push('/dashboard?error=processing-failed')
        return
      }

      // Success - Redirect directly to the Review Screen
      reset()
      router.push(`/dashboard/review/${newProduct.id}`)
      
    } catch (err: any) {
      console.error(err)
      setError(err.message || "An error occurred while uploading. Please try again.")
      setIsUploading(false)
    }
  }

  return (
    <div className="container flex flex-col items-center max-w-md mx-auto pt-6 px-4">
      {/* Progress Bar */}
      <div className="w-full flex items-center justify-between mb-8 relative px-4">
        <div className="absolute top-1/2 left-4 right-4 h-1 bg-border -z-10 -translate-y-1/2"></div>
        {[1, 2, 3].map((s) => (
          <div 
            key={s} 
            className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-colors ${
              step >= s ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
            }`}
          >
            {s}
          </div>
        ))}
      </div>

      {error && (
        <div className="w-full p-4 mb-4 bg-destructive/10 text-destructive text-sm rounded-lg border border-destructive/20 text-center">
          {error}
        </div>
      )}

      {/* Step 1: Camera */}
      {step === 1 && (
        <div className="w-full flex flex-col items-center">
          <h2 className="text-2xl font-bold mb-6 text-foreground">Take a Photo</h2>
          <CameraCapture onCapture={handleImageCapture} />
        </div>
      )}

      {/* Step 2: Voice */}
      {step === 2 && (
        <div className="w-full flex flex-col items-center">
          <h2 className="text-2xl font-bold mb-6 text-foreground">Record Details</h2>
          <VoiceRecorder onRecord={handleAudioRecord} />
          <Button variant="ghost" onClick={() => setStep(1)} className="mt-6 text-muted-foreground">Back to Camera</Button>
        </div>
      )}

      {/* Step 3: Cost & Category */}
      {step === 3 && (
        <div className="w-full flex flex-col items-center w-full max-w-sm">
          <h2 className="text-2xl font-bold mb-6 text-foreground">Final Details</h2>
          
          <div className="w-full space-y-6 bg-card p-6 rounded-2xl border border-border shadow-sm">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Raw Material Cost (₹)</label>
              <Input 
                type="number" 
                placeholder="0.00"
                className="h-14 text-lg"
                value={materialCost || ''}
                onChange={(e) => setCost(Number(e.target.value))}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Category</label>
              <div className="grid grid-cols-2 gap-2">
                {CATEGORIES.map(c => (
                  <button
                    key={c}
                    onClick={() => setCategory(c)}
                    className={`py-3 px-4 rounded-xl text-sm font-medium transition-colors border ${
                      category === c 
                        ? 'bg-primary text-primary-foreground border-primary' 
                        : 'bg-background text-foreground border-border hover:bg-muted'
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="flex w-full gap-4 mt-8">
            <Button variant="outline" onClick={() => setStep(2)} className="flex-1 h-14 rounded-xl text-base">Back</Button>
            <Button 
              onClick={handleUploadAndSubmit} 
              disabled={isUploading || !materialCost || !category} 
              className="flex-1 h-14 rounded-xl text-base"
            >
              {isUploading ? <Loader className="w-6 h-6 text-primary-foreground" /> : 'Submit'}
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
