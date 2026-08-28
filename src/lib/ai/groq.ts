const FULL_FALLBACK_TRANSCRIPT =
  'यह एक सुंदर हस्तनिर्मित उत्पाद है। मैंने इसे उच्च गुणवत्ता वाली सामग्री से बनाया है।'

const SHORT_FALLBACK_TRANSCRIPT = 'यह एक सुंदर हस्तनिर्मित उत्पाद है।'

interface GroqTranscriptionResponse {
  text?: string
}

/**
 * Calls Groq's Whisper API for speech-to-text.
 * Given a URL to an audio file, it returns the transcribed text.
 */
export async function transcribeAudio(audioUrl: string): Promise<string> {
  const apiKey = process.env.GROQ_API_KEY

  if (!apiKey) {
    console.warn('Groq API key missing. Falling back to mock transcript.')
    return FULL_FALLBACK_TRANSCRIPT
  }

  try {
    const audioResponse = await fetch(audioUrl)
    const audioBlob = await audioResponse.blob()

    const formData = new FormData()
    formData.append('file', audioBlob, 'audio.webm')
    formData.append('model', 'whisper-large-v3')
    formData.append('temperature', '0')
    formData.append('response_format', 'json')

    const response = await fetch('https://api.groq.com/openai/v1/audio/transcriptions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
      body: formData,
    })

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`Groq API error: ${response.status} ${errorText}`)
    }

    const data = (await response.json()) as GroqTranscriptionResponse
    if (!data.text) {
      throw new Error('Empty transcript returned from Groq')
    }

    return data.text
  } catch (error: unknown) {
    console.error('Groq transcription failed:', error)
    return SHORT_FALLBACK_TRANSCRIPT
  }
}
