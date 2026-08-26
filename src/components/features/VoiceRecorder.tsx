'use client'

import React, { useState, useRef, useEffect } from 'react'
import { Mic, Square, RotateCcw, Check } from 'lucide-react'
import { Button } from '@/src/components/ui/Button'

interface VoiceRecorderProps {
  onRecord: (file: File) => void
}

export function VoiceRecorder({ onRecord }: VoiceRecorderProps) {
  const [isRecording, setIsRecording] = useState(false)
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null)
  const [audioUrl, setAudioUrl] = useState<string | null>(null)
  const [recordingTime, setRecordingTime] = useState(0)
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const chunksRef = useRef<Blob[]>([])
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [])

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      mediaRecorderRef.current = new MediaRecorder(stream)
      chunksRef.current = []

      mediaRecorderRef.current.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data)
      }

      mediaRecorderRef.current.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' })
        setAudioBlob(blob)
        setAudioUrl(URL.createObjectURL(blob))
        stream.getTracks().forEach(track => track.stop())
      }

      mediaRecorderRef.current.start()
      setIsRecording(true)
      setRecordingTime(0)
      
      timerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1)
      }, 1000)

    } catch (err) {
      console.error("Error accessing microphone:", err)
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
      setIsRecording(false)
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }

  const handleRetake = () => {
    setAudioBlob(null)
    if (audioUrl) URL.revokeObjectURL(audioUrl)
    setAudioUrl(null)
    setRecordingTime(0)
  }

  const handleConfirm = () => {
    if (audioBlob) {
      const file = new File([audioBlob], 'voice-note.webm', { type: 'audio/webm' })
      onRecord(file)
    }
  }

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60)
    const s = seconds % 60
    return `${m}:${s.toString().padStart(2, '0')}`
  }

  return (
    <div className="flex flex-col items-center justify-center p-6 bg-card border border-border rounded-2xl w-full max-w-sm shadow-sm">
      
      {!audioUrl ? (
        <div className="flex flex-col items-center space-y-8">
          <div className="text-center">
            <h3 className="text-xl font-semibold text-foreground">Describe your product</h3>
            <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
              Mention what it is, how it's made, and its cultural significance.
            </p>
          </div>

          <div className="relative flex items-center justify-center py-4">
            {isRecording && (
              <>
                <div className="absolute w-28 h-28 bg-destructive/20 rounded-full animate-ping" />
                <div className="absolute w-32 h-32 border border-destructive/30 rounded-full animate-pulse" />
              </>
            )}
            
            <button
              onClick={isRecording ? stopRecording : startRecording}
              className={`relative z-10 w-24 h-24 rounded-full flex items-center justify-center transition-all shadow-lg ${
                isRecording 
                  ? 'bg-destructive text-destructive-foreground hover:bg-destructive/90 scale-95' 
                  : 'bg-primary text-primary-foreground hover:bg-primary/90 scale-100'
              }`}
            >
              {isRecording ? <Square className="w-10 h-10 fill-current" /> : <Mic className="w-10 h-10" />}
            </button>
          </div>

          <div className="text-3xl font-mono text-foreground font-medium tabular-nums">
            {formatTime(recordingTime)}
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center space-y-6 w-full">
          <audio controls src={audioUrl} className="w-full h-14" />
          
          <div className="flex w-full justify-around gap-4 pt-4">
            <Button variant="outline" onClick={handleRetake} className="flex-1 h-14 rounded-xl text-base gap-2">
              <RotateCcw className="w-5 h-5" /> Redo
            </Button>
            <Button onClick={handleConfirm} className="flex-1 h-14 rounded-xl text-base gap-2">
              <Check className="w-5 h-5" /> Keep
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
