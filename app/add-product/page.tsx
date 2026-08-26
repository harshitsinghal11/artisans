'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { CameraCapture } from '@/src/components/features/CameraCapture'
import { VoiceRecorder } from '@/src/components/features/VoiceRecorder'
import { useProductStore, ProductCategory } from '@/src/hooks/useProductStore'
import { Button } from '@/src/components/ui/Button'
import { Input } from '@/src/components/ui/Input'
import { Loader } from '@/src/components/ui/Loader'
import { useSubmitProduct } from '@/src/hooks/useSubmitProduct'

const CATEGORIES: ProductCategory[] = ['Textiles', 'Pottery', 'Woodwork', 'Jewelry', 'Art', 'Other']

export default function AddProductPage() {
  const router = useRouter()
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1)
  const { materialCost, category, setImage, setAudio, setCost, setCategory } = useProductStore()
  const { submitProduct, status, error } = useSubmitProduct()
  const isUploading = status !== 'idle'
  const [lang, setLang] = useState<'en' | 'hi'>('en')

  // Read language cookie on mount
  useState(() => {
    if (typeof window !== 'undefined') {
      const match = document.cookie.match(new RegExp('(^| )NEXT_LOCALE=([^;]+)'))
      if (match && match[2] === 'hi') {
        setLang('hi')
      }
    }
  })

  // Dynamic loading messages based on status
  const loadingMessages = {
    en: {
      uploading_media: 'Uploading image and voice note...',
      saving_db: 'Saving product details...',
      processing_ai: 'AI is analyzing craftsmanship & generating pricing...'
    },
    hi: {
      uploading_media: 'छवि और वॉयस नोट अपलोड हो रहे हैं...',
      saving_db: 'उत्पाद विवरण सहेजा जा रहा है...',
      processing_ai: 'AI शिल्प कौशल का विश्लेषण और मूल्य निर्धारण कर रहा है...'
    }
  }

  const handleImageCapture = (file: File) => {
    setImage(file)
    setStep(2)
  }

  const handleAudioRecord = (file: File) => {
    setAudio(file)
    setStep(3)
  }

  const handleUploadAndSubmit = () => {
    submitProduct()
  }

  return (
    <div className="container flex flex-col items-center max-w-md mx-auto pt-6 px-4">
      {/* Progress Bar */}
      <div className="w-full flex items-center justify-between mb-8 relative px-4">
        <div className="absolute top-1/2 left-4 right-4 h-1 bg-border -z-10 -translate-y-1/2"></div>
        {[1, 2, 3].map((s) => (
          <div
            key={s}
            className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-colors ${step >= s ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
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

      {/* Loading Overlay */}
      {status !== 'idle' && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm rounded-xl">
          <div className="flex flex-col items-center p-6 text-center">
            <Loader className="h-10 w-10 text-primary mb-4" />
            <p className="font-medium text-foreground max-w-[200px]">
              {loadingMessages[lang][status as keyof typeof loadingMessages['en']] || 'Processing...'}
            </p>
          </div>
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
                    className={`py-3 px-4 rounded-xl text-sm font-medium transition-colors border ${category === c
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
