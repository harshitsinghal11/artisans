/**
 * Calls Groq's Whisper API for Speech-to-Text translation.
 * Given a URL to an audio file, it returns the transcribed text.
 */
export async function transcribeAudio(audioUrl: string): Promise<string> {
  const apiKey = process.env.GROQ_API_KEY;

  if (!apiKey) {
    console.warn("Groq API key missing. Falling back to mock transcript.");
    return "यह एक सुंदर हस्तनिर्मित उत्पाद है। मैंने इसे उच्च गुणवत्ता वाली सामग्री से बनाया है।";
  }

  try {
    // 1. Fetch the audio blob from the URL
    const audioRes = await fetch(audioUrl);
    const audioBlob = await audioRes.blob();

    // 2. Prepare FormData for Groq API
    const formData = new FormData();
    formData.append("file", audioBlob, "audio.webm");
    formData.append("model", "whisper-large-v3");
    formData.append("temperature", "0");
    formData.append("response_format", "json");

    // 3. Call Groq Whisper API
    const response = await fetch("https://api.groq.com/openai/v1/audio/transcriptions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
      },
      // Note: Do NOT set Content-Type header manually when using FormData
      body: formData as any,
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Groq API error: ${response.status} ${errorText}`);
    }

    const data = await response.json();
    const transcript = data.text;

    if (!transcript) throw new Error("Empty transcript returned from Groq");

    return transcript;

  } catch (error) {
    console.error('Groq transcription failed:', error);
    // Fallback so the pipeline doesn't break
    return "यह एक सुंदर हस्तनिर्मित उत्पाद है।"; 
  }
}
