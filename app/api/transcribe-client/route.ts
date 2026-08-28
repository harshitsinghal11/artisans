import { NextResponse } from 'next/server'
import { getErrorMessage } from '@/src/lib/errors'

const FULL_FALLBACK_TRANSCRIPT =
  'यह एक सुंदर हस्तनिर्मित उत्पाद है। मैंने इसे उच्च गुणवत्ता वाली सामग्री से बनाया है।'

const SHORT_FALLBACK_TRANSCRIPT = 'यह एक सुंदर हस्तनिर्मित उत्पाद है।'

interface GroqTranscriptionResponse {
  text?: string
}

export async function POST(req: Request) {
  try {
    const formData = await req.formData()
    const file = formData.get('file')

    if (!(file instanceof Blob)) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    const apiKey = process.env.GROQ_API_KEY

    if (!apiKey) {
      console.warn('Groq API key missing. Falling back to mock transcript.')
      return NextResponse.json({ transcript: FULL_FALLBACK_TRANSCRIPT })
    }

    const groqFormData = new FormData()
    groqFormData.append('file', file, 'audio.webm')
    groqFormData.append('model', 'whisper-large-v3')
    groqFormData.append('temperature', '0')
    groqFormData.append('response_format', 'json')

    const response = await fetch('https://api.groq.com/openai/v1/audio/transcriptions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
      body: groqFormData,
    })

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`Groq API error: ${response.status} ${errorText}`)
    }

    const data = (await response.json()) as GroqTranscriptionResponse
    if (!data.text) {
      throw new Error('Empty transcript returned from Groq')
    }

    return NextResponse.json({ transcript: data.text })
  } catch (error: unknown) {
    console.error('Client STT failed:', error)
    console.warn(getErrorMessage(error))
    return NextResponse.json({ transcript: SHORT_FALLBACK_TRANSCRIPT })
  }
}
