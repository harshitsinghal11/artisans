'use client'

import React, { useState, useRef, useEffect } from 'react'
import { Mic, Square, RotateCcw, Check, Loader2 } from 'lucide-react'
import { Button } from '@/src/components/ui/Button'
import fixWebmDuration from 'webm-duration-fix'


interface VoiceRecorderProps {
  onRecord: (file: File) => void
}

export function VoiceRecorder({ onRecord }: VoiceRecorderProps) {
  const [isRecording, setIsRecording] = useState(false)
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null)
  const [audioUrl, setAudioUrl] = useState<string | null>(null)
  const [recordingTime, setRecordingTime] = useState(0)

  const [isTranscribing, setIsTranscribing] = useState(false)
  const [transcript, setTranscript] = useState<string | null>(null)

  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const chunksRef = useRef<Blob[]>([])
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [])

  const transcribeLocal = async (blob: Blob) => {
    setIsTranscribing(true)
    setTranscript(null)
    try {
      const formData = new FormData()
      formData.append('file', blob, 'audio.webm')
      const res = await fetch('/api/transcribe-client', {
        method: 'POST',
        body: formData
      })
      const data = await res.json()
      if (data.transcript) {
        setTranscript(data.transcript)
      }
    } catch (e) {
      console.error(e)
    } finally {
      setIsTranscribing(false)
    }
  }

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      mediaRecorderRef.current = new MediaRecorder(stream)
      chunksRef.current = []

      mediaRecorderRef.current.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data)
      }

      mediaRecorderRef.current.onstop = async () => {
        const mimeType = mediaRecorderRef.current?.mimeType || ''
        const rawBlob = new Blob(chunksRef.current, { type: mimeType })
        const fixedBlob = await fixWebmDuration(rawBlob) // patches duration into the container
        setAudioBlob(fixedBlob)
        setAudioUrl(URL.createObjectURL(fixedBlob))
        stream.getTracks().forEach(track => track.stop())
        transcribeLocal(fixedBlob)
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
    setTranscript(null)
  }

  const handleConfirm = () => {
    if (audioBlob) {
      const mimeType = audioBlob.type || 'audio/webm'
      const ext = mimeType.includes('mp4') ? 'mp4' : mimeType.includes('ogg') ? 'ogg' : mimeType.includes('wav') ? 'wav' : 'webm'
      const file = new File([audioBlob], `voice-note.${ext}`, { type: mimeType })
      onRecord(file)
    }
  }

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60)
    const s = seconds % 60
    return `${m}:${s.toString().padStart(2, '0')}`
  }

  // Workaround for chromium webm duration issue:
  const handleLoadedMetadata = (e: React.SyntheticEvent<HTMLAudioElement>) => {
    const audio = e.currentTarget;
    if (audio.duration === Infinity) {
      audio.currentTime = 1e101;
      audio.ontimeupdate = () => {
        audio.ontimeupdate = null;
        audio.currentTime = 0;
      };
    }
  }

  const fixDurationAndSetUrl = (blob: Blob) => {
    const tempUrl = URL.createObjectURL(blob)
    const tempAudio = document.createElement('audio')
    tempAudio.preload = 'metadata'
    tempAudio.src = tempUrl

    tempAudio.onloadedmetadata = () => {
      if (tempAudio.duration === Infinity) {
        tempAudio.currentTime = 1e101
        tempAudio.ontimeupdate = () => {
          tempAudio.ontimeupdate = null
          // duration is now correct internally; safe to show the real player
          setAudioUrl(tempUrl)
        }
      } else {
        setAudioUrl(tempUrl)
      }
    }
  }

  return (
    <div className="flex flex-col items-center justify-center p-6 bg-card border border-border rounded-2xl w-full max-w-sm shadow-sm">

      {!audioUrl ? (
        <div className="flex flex-col items-center space-y-8">
          <div className="text-center">
            <h3 className="text-xl font-semibold text-foreground">Describe your product</h3>
            <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
              Mention what it is, how it&apos;s made, and its cultural significance.
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
              className={`relative z-10 w-24 h-24 rounded-full flex items-center justify-center transition-all shadow-lg ${isRecording
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
          <div className="w-full flex flex-col gap-2">
            <div className="flex justify-between items-center text-xs text-muted-foreground px-2">
              <span>Duration: {formatTime(recordingTime)}</span>
            </div>
            <audio controls src={audioUrl} onLoadedMetadata={handleLoadedMetadata} className="w-full h-14" />
          </div>

          <div className="w-full bg-muted/30 border border-border/50 rounded-xl p-4 min-h-[80px] flex items-center justify-center">
            {isTranscribing ? (
              <div className="flex flex-col items-center text-muted-foreground">
                <Loader2 className="w-5 h-5 animate-spin mb-2" />
                <span className="text-sm">Transcribing voice note...</span>
              </div>
            ) : transcript ? (
              <p className="text-sm text-foreground/90 italic text-center leading-relaxed">&quot;{transcript}&quot;</p>
            ) : (
              <span className="text-sm text-muted-foreground">No transcript available.</span>
            )}
          </div>

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
