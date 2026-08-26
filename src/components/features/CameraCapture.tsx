'use client'

import React, { useRef, useState, useCallback, useEffect } from 'react'
import { Camera, RefreshCw, Check } from 'lucide-react'
import { Button } from '@/src/components/ui/Button'

interface CameraCaptureProps {
  onCapture: (file: File) => void
}

export function CameraCapture({ onCapture }: CameraCaptureProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [stream, setStream] = useState<MediaStream | null>(null)
  const [photoUrl, setPhotoUrl] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop())
      }
    }
  }, [stream])

  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream
    }
  }, [stream])

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' }
      })
      setStream(mediaStream)
      setError(null)
    } catch (err) {
      console.error("Error accessing camera:", err)
      setError("Could not access the camera. Please allow permissions.")
    }
  }

  const stopCamera = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop())
      setStream(null)
    }
  }, [stream])

  const takePhoto = () => {
    if (videoRef.current) {
      const canvas = document.createElement('canvas')
      canvas.width = videoRef.current.videoWidth
      canvas.height = videoRef.current.videoHeight
      const ctx = canvas.getContext('2d')
      if (ctx) {
        ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height)
        const dataUrl = canvas.toDataURL('image/jpeg', 0.8)
        setPhotoUrl(dataUrl)
        stopCamera()
      }
    }
  }

  const handleRetake = () => {
    setPhotoUrl(null)
    startCamera()
  }

  const handleConfirm = async () => {
    if (photoUrl) {
      const res = await fetch(photoUrl)
      const blob = await res.blob()
      const file = new File([blob], 'product-photo.jpg', { type: 'image/jpeg' })
      onCapture(file)
    }
  }

  return (
    <div className="flex flex-col items-center justify-center space-y-4 w-full">
      {!stream && !photoUrl && (
        <div className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-border rounded-xl w-full max-w-sm bg-card">
          <Camera className="w-12 h-12 text-muted-foreground mb-4" />
          <Button onClick={startCamera}>Open Camera</Button>
          {error && <p className="text-destructive mt-4 text-sm text-center">{error}</p>}
        </div>
      )}

      {stream && !photoUrl && (
        <div className="relative w-full max-w-sm rounded-xl overflow-hidden bg-black aspect-[3/4]">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            className="w-full h-full object-cover"
          />
          <div className="absolute bottom-6 left-0 right-0 flex justify-center">
            <button
              onClick={takePhoto}
              className="w-16 h-16 rounded-full border-4 border-white bg-white/20 backdrop-blur-sm flex items-center justify-center hover:bg-white/40 transition-colors"
            >
              <div className="w-12 h-12 rounded-full bg-white"></div>
            </button>
          </div>
        </div>
      )}

      {photoUrl && (
        <div className="relative w-full max-w-sm rounded-xl overflow-hidden bg-black aspect-[3/4]">
          <img src={photoUrl} alt="Captured product" className="w-full h-full object-cover" />
          <div className="absolute bottom-6 left-0 right-0 flex justify-around px-4">
            <Button variant="secondary" onClick={handleRetake} className="rounded-full shadow-lg h-14 px-6 gap-2">
              <RefreshCw className="w-5 h-5" /> Retake
            </Button>
            <Button onClick={handleConfirm} className="rounded-full shadow-lg h-14 px-6 gap-2">
              <Check className="w-5 h-5" /> Looks Good
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
