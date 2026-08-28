'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { Camera, Check, RefreshCw } from 'lucide-react'
import { Button } from '@/src/components/ui/Button'
import { getErrorMessage } from '@/src/lib/errors'
import { useProductStore } from '@/src/hooks/useProductStore'

interface CameraCaptureProps {
  onCapture: (file: File) => void
}

export function CameraCapture({ onCapture }: CameraCaptureProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [stream, setStream] = useState<MediaStream | null>(null)
  const [photoUrl, setPhotoUrl] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const { removeBackground, setRemoveBackground } = useProductStore()

  useEffect(() => {
    return () => {
      stream?.getTracks().forEach((track) => track.stop())
    }
  }, [stream])

  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream
    }
  }, [stream])

  const stopCamera = useCallback(() => {
    stream?.getTracks().forEach((track) => track.stop())
    setStream(null)
  }, [stream])

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' },
      })
      setStream(mediaStream)
      setError(null)
    } catch (error: unknown) {
      console.error('Error accessing camera:', error)
      setError(getErrorMessage(error, 'Could not access the camera. Please allow permissions.'))
    }
  }

  const takePhoto = () => {
    if (!videoRef.current) {
      return
    }

    const canvas = document.createElement('canvas')
    canvas.width = videoRef.current.videoWidth
    canvas.height = videoRef.current.videoHeight
    const context = canvas.getContext('2d')

    if (!context) {
      setError('Unable to capture the current frame.')
      return
    }

    context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height)
    setPhotoUrl(canvas.toDataURL('image/jpeg', 0.8))
    stopCamera()
  }

  const handleRetake = () => {
    setPhotoUrl(null)
    startCamera()
  }

  const handleConfirm = async () => {
    if (!photoUrl) {
      return
    }

    const response = await fetch(photoUrl)
    const blob = await response.blob()
    onCapture(new File([blob], 'product-photo.jpg', { type: 'image/jpeg' }))
  }

  return (
    <div className="flex w-full flex-col items-center justify-center space-y-4">
      {!stream && !photoUrl ? (
        <div className="flex w-full max-w-sm flex-col items-center justify-center rounded-2xl border-2 border-dashed border-border bg-card p-8">
          <Camera className="mb-4 h-12 w-12 text-muted-foreground" />
          <Button onClick={startCamera}>Open Camera</Button>
          {error ? <p className="mt-4 text-center text-sm text-destructive">{error}</p> : null}
        </div>
      ) : null}

      {stream && !photoUrl ? (
        <div className="relative aspect-[3/4] w-full max-w-sm overflow-hidden rounded-2xl bg-black">
          <video ref={videoRef} autoPlay playsInline className="h-full w-full object-cover" />
          <div className="absolute bottom-6 left-0 right-0 flex justify-center">
            <button
              type="button"
              onClick={takePhoto}
              aria-label="Take photo"
              className="flex h-16 w-16 items-center justify-center rounded-full border-4 border-white bg-white/20 transition-colors hover:bg-white/40"
            >
              <div className="h-12 w-12 rounded-full bg-white" />
            </button>
          </div>
        </div>
      ) : null}

      {photoUrl ? (
        <>
          <div className="relative aspect-[3/4] w-full max-w-sm overflow-hidden rounded-2xl bg-black">
            <Image
              src={photoUrl}
              alt="Captured product"
              fill
              unoptimized
              sizes="(max-width: 640px) 100vw, 400px"
              className="object-cover"
            />
            <div className="absolute bottom-6 left-0 right-0 flex justify-around px-4">
              <Button variant="secondary" onClick={handleRetake} className="h-14 gap-2 rounded-full px-6">
                <RefreshCw className="h-5 w-5" /> Retake
              </Button>
              <Button onClick={handleConfirm} className="h-14 gap-2 rounded-full px-6">
                <Check className="h-5 w-5" /> Looks Good
              </Button>
            </div>

          </div>
          <div className="z-10 flex items-center space-x-2 px-3 py-2 text-black cursor-default select-none">
            <input
              type="checkbox"
              id="remove-bg"
              checked={removeBackground}
              onChange={(e) => setRemoveBackground(e.target.checked)}
              className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
            />
            <label htmlFor="remove-bg" className="text-sm font-medium leading-none">
              Remove Background
            </label>
          </div>
        </>
      ) : null}
    </div>
  )
}
