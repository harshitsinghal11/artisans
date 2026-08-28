'use client'

import { useState } from 'react'
import { CameraCapture } from '@/src/components/features/CameraCapture'
import { VoiceRecorder } from '@/src/components/features/VoiceRecorder'
import { useProductStore, type ProductCategory } from '@/src/hooks/useProductStore'
import { Button } from '@/src/components/ui/Button'
import { Input } from '@/src/components/ui/Input'
import { Loader } from '@/src/components/ui/Loader'
import { useSubmitProduct } from '@/src/hooks/useSubmitProduct'
import { dictionaries, type Language } from '@/src/lib/i18n/dictionaries'
import { readClientLanguage } from '@/src/lib/i18n/client'

const CATEGORIES: ProductCategory[] = ['Textiles', 'Pottery', 'Woodwork', 'Jewellery', 'Art', 'Other']

const STATUS_COPY = {
  uploading_media: 'uploadingMedia',
  saving_db: 'savingDetails',
  processing_ai: 'processingAi',
} as const

export default function AddProductPage() {
  const [step, setStep] = useState<1 | 2 | 3>(1)
  const [lang] = useState<Language>(() => readClientLanguage())
  const { materialCost, category, setImage, setAudio, setCost, setCategory } = useProductStore()
  const { submitProduct, status, error } = useSubmitProduct()
  const isUploading = status !== 'idle'
  const t = dictionaries[lang]

  const categoryMapping: Record<ProductCategory, string> = {
    Textiles: t.catTextiles,
    Pottery: t.catPottery,
    Woodwork: t.catWoodwork,
    Jewellery: t.catJewellery,
    Art: t.catArt,
    Other: t.catOther,
  }

  const handleCostChange = (value: string) => {
    if (!value) {
      setCost(null)
      return
    }

    const parsedValue = Number(value)
    setCost(Number.isFinite(parsedValue) ? parsedValue : null)
  }

  return (
    <>
      {isUploading ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/90 px-6">
          <div className="flex max-w-xs flex-col items-center rounded-2xl border border-border bg-card p-6 text-center">
            <Loader className="mb-4 h-10 w-10 text-primary" />
            <p className="font-medium text-foreground">
              {t[STATUS_COPY[status as keyof typeof STATUS_COPY]]}
            </p>
          </div>
        </div>
      ) : null}

      <div className="mx-auto flex w-full max-w-md flex-col px-4 py-6">
        <div className="relative mb-8 flex w-full items-center justify-between px-4">
          <div className="absolute left-4 right-4 top-1/2 -z-10 h-1 -translate-y-1/2 bg-border" />
          {[1, 2, 3].map((currentStep) => (
            <div
              key={currentStep}
              className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold ${step >= currentStep
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted text-muted-foreground'
                }`}
            >
              {currentStep}
            </div>
          ))}
        </div>

        {error ? (
          <div className="mb-4 rounded-2xl border border-destructive/20 bg-destructive/10 p-4 text-center text-sm text-destructive">
            {error}
          </div>
        ) : null}

        {step === 1 ? (
          <section className="flex w-full flex-col items-center">
            <h1 className="mb-2 text-center text-2xl font-bold text-foreground">{t.takePhoto}</h1>
            <p className="mb-6 text-center text-sm text-muted-foreground">
              Capture one clear product photo with the item fully visible.
            </p>
            <CameraCapture
              onCapture={(file) => {
                setImage(file)
                setStep(2)
              }}
            />
          </section>
        ) : null}

        {step === 2 ? (
          <section className="flex w-full flex-col items-center">
            <h1 className="mb-2 text-center text-2xl font-bold text-foreground">{t.recordDetails}</h1>
            <p className="mb-6 text-center text-sm text-muted-foreground">
              Explain what the product is, how it is made, and what makes it special.
            </p>
            <VoiceRecorder
              onRecord={(file) => {
                setAudio(file)
                setStep(3)
              }}
            />
            <Button variant="ghost" onClick={() => setStep(1)} className="mt-6 text-muted-foreground">
              {t.backToCamera}
            </Button>
          </section>
        ) : null}

        {step === 3 ? (
          <section className="w-full">
            <h1 className="mb-6 text-center text-2xl font-bold text-foreground">{t.finalDetails}</h1>

            <div className="space-y-6 rounded-2xl border border-border bg-card p-6">
              <div className="space-y-2">
                <label htmlFor="material-cost" className="text-sm font-medium text-foreground">
                  {t.rawMaterialCost}
                </label>
                <Input
                  id="material-cost"
                  type="number"
                  min="0"
                  inputMode="decimal"
                  placeholder="0.00"
                  className="h-14 text-lg"
                  value={materialCost ?? ''}
                  onChange={(event) => handleCostChange(event.target.value)}
                />
              </div>

              <div className="space-y-2">
                <p className="text-sm font-medium text-foreground">{t.categoryLabel}</p>
                <div className="grid grid-cols-2 gap-2">
                  {CATEGORIES.map((item) => (
                    <button
                      key={item}
                      type="button"
                      onClick={() => setCategory(item)}
                      className={`rounded-xl border px-4 py-3 text-sm font-medium ${category === item
                        ? 'border-primary bg-primary text-primary-foreground'
                        : 'border-border bg-background text-foreground hover:bg-muted'
                        }`}
                    >
                      {categoryMapping[item]}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-8 flex w-full gap-4">
              <Button variant="outline" onClick={() => setStep(2)} className="h-14 flex-1 rounded-xl text-base">
                {t.back}
              </Button>
              <Button
                onClick={submitProduct}
                disabled={isUploading || materialCost === null || materialCost < 0 || !category}
                className="h-14 flex-1 rounded-xl text-base"
              >
                {isUploading ? <Loader className="h-6 w-6 text-primary-foreground" /> : t.submit}
              </Button>
            </div>
          </section>
        ) : null}
      </div>
    </>
  )
}
