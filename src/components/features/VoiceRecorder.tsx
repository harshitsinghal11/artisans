'use client'

import { useEffect, useRef, useState } from 'react'
import { Check, Loader2, Mic, RotateCcw, Square } from 'lucide-react'
import fixWebmDuration from 'fix-webm-duration'
import { Button } from '@/src/components/ui/Button'
import { getErrorMessage } from '@/src/lib/errors'

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
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }

      if (audioUrl) {
        URL.revokeObjectURL(audioUrl)
      }
    }
  }, [audioUrl])

  const transcribeLocal = async (blob: Blob) => {
    setIsTranscribing(true)
    setTranscript(null)

    try {
      const formData = new FormData()
      formData.append('file', blob, 'audio.webm')
      const response = await fetch('/api/transcribe-client', {
        method: 'POST',
        body: formData,
      })
      const data = (await response.json()) as { transcript?: string }

      if (data.transcript) {
        setTranscript(data.transcript)
      }
    } catch (error: unknown) {
      console.error(error)
      setTranscript(getErrorMessage(error, 'Transcript unavailable.'))
    } finally {
      setIsTranscribing(false)
    }
  }

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })

      // Route stream through AudioContext to reset timestamps to 0
      // This prevents Chrome's bug where WebM cluster timestamps are based on page load time
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext
      const audioCtx = new AudioContextClass()
      const source = audioCtx.createMediaStreamSource(stream)
      const destination = audioCtx.createMediaStreamDestination()
      source.connect(destination)

      const recorder = new MediaRecorder(destination.stream)

      mediaRecorderRef.current = recorder
      chunksRef.current = []

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data)
        }
      }

      recorder.onstop = async () => {
        try {
          const mimeType = recorder.mimeType || 'audio/webm'
          const rawBlob = new Blob(chunksRef.current, { type: mimeType })
          const durationMs = recordingTime * 1000
          const fixedBlob = await fixWebmDuration(rawBlob, durationMs).catch(() => rawBlob)
          const nextAudioUrl = URL.createObjectURL(fixedBlob)

          setAudioBlob(fixedBlob)
          setAudioUrl((currentAudioUrl) => {
            if (currentAudioUrl) {
              URL.revokeObjectURL(currentAudioUrl)
            }

            return nextAudioUrl
          })
          stream.getTracks().forEach((track) => track.stop())
          destination.stream.getTracks().forEach((track) => track.stop())
          void audioCtx.close()

          void transcribeLocal(fixedBlob)
        } catch (error: unknown) {
          console.error('Error processing recording:', error)
        }
      }

      recorder.start()
      setIsRecording(true)
      setRecordingTime(0)
      timerRef.current = setInterval(() => {
        setRecordingTime((previousValue) => previousValue + 1)
      }, 1000)
    } catch (error: unknown) {
      console.error('Error accessing microphone:', error)
    }
  }

  const stopRecording = () => {
    if (!mediaRecorderRef.current || !isRecording) {
      return
    }

    mediaRecorderRef.current.stop()
    setIsRecording(false)

    if (timerRef.current) {
      clearInterval(timerRef.current)
    }
  }

  const handleRetake = () => {
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl)
    }

    setAudioBlob(null)
    setAudioUrl(null)
    setRecordingTime(0)
    setTranscript(null)
  }

  const handleConfirm = () => {
    if (!audioBlob) {
      return
    }

    const mimeType = audioBlob.type || 'audio/webm'
    const extension = mimeType.includes('mp4')
      ? 'mp4'
      : mimeType.includes('ogg')
        ? 'ogg'
        : mimeType.includes('wav')
          ? 'wav'
          : 'webm'

    onRecord(new File([audioBlob], `voice-note.${extension}`, { type: mimeType }))
  }

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
  }

  const handleLoadedMetadata = (event: React.SyntheticEvent<HTMLAudioElement>) => {
    const audioElement = event.currentTarget
    if (audioElement.duration === Infinity) {
      audioElement.currentTime = 1e101
      audioElement.ontimeupdate = () => {
        audioElement.ontimeupdate = null
        audioElement.currentTime = 0
      }
    }
  }

  return (
    <div className="flex w-full flex-col items-center justify-center rounded-2xl border border-border bg-card p-6">
      {!audioUrl ? (
        <div className="flex flex-col items-center space-y-8">
          <div className="text-center">
            <h2 className="text-xl font-semibold text-foreground">Describe your product</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              Mention what it is, how it&apos;s made, and its cultural significance.
            </p>
          </div>

          <div className="relative flex items-center justify-center py-4">
            {isRecording ? (
              <>
                <div className="absolute h-28 w-28 rounded-full bg-destructive/20 animate-ping" />
                <div className="absolute h-32 w-32 rounded-full border border-destructive/30 animate-pulse" />
              </>
            ) : null}

            <button
              type="button"
              onClick={isRecording ? stopRecording : startRecording}
              aria-label={isRecording ? 'Stop recording' : 'Start recording'}
              className={`relative z-10 flex h-24 w-24 items-center justify-center rounded-full transition-all ${isRecording
                ? 'bg-destructive text-white hover:bg-destructive/90 scale-95'
                : 'bg-primary text-primary-foreground hover:bg-primary/90 scale-100'
                }`}
            >
              {isRecording ? <Square className="h-10 w-10 fill-current" /> : <Mic className="h-10 w-10" />}
            </button>
          </div>

          <div className="font-mono text-3xl font-medium tabular-nums text-foreground">
            {formatTime(recordingTime)}
          </div>
        </div>
      ) : (
        <div className="flex w-full flex-col items-center space-y-6">
          <div className="flex w-full flex-col gap-2">
            <audio controls src={audioUrl} onLoadedMetadata={handleLoadedMetadata} className="h-14 w-full" />
          </div>

          <div className="flex min-h-[80px] w-full items-center justify-center rounded-xl border border-border/50 bg-muted/30 p-4">
            {isTranscribing ? (
              <div className="flex flex-col items-center text-muted-foreground">
                <Loader2 className="mb-2 h-5 w-5 animate-spin" />
                <span className="text-sm">Transcribing voice note...</span>
              </div>
            ) : transcript ? (
              <p className="text-center text-sm italic leading-relaxed text-foreground/90">&quot;{transcript}&quot;</p>
            ) : (
              <span className="text-sm text-muted-foreground">No transcript available.</span>
            )}
          </div>

          <div className="flex w-full gap-4 pt-4">
            <Button variant="outline" onClick={handleRetake} className="h-14 flex-1 gap-2 rounded-xl text-base">
              <RotateCcw className="h-5 w-5" /> Redo
            </Button>
            <Button onClick={handleConfirm} className="h-14 flex-1 gap-2 rounded-xl text-base">
              <Check className="h-5 w-5" /> Keep
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
