/**
 * Calls Bhashini API for Speech-to-Text translation.
 * Given a URL to an audio file, it returns the transcribed text.
 * 
 * Note: Bhashini APIs often require specific authentication headers.
 * If credentials are not provided or the API fails, this falls back to a mock transcript.
 */
export async function transcribeAudio(audioUrl: string): Promise<string> {
  const userId = process.env.BHASHINI_USER_ID;
  const apiKey = process.env.BHASHINI_API_KEY;
  const pipelineId = process.env.BHASHINI_PIPELINE_ID;

  // Mock Fallback if keys are missing
  if (!userId || !apiKey || !pipelineId) {
    console.warn("Bhashini keys missing. Falling back to mock transcript.");
    return "यह एक सुंदर हस्तनिर्मित उत्पाद है। मैंने इसे उच्च गुणवत्ता वाली सामग्री से बनाया है।";
  }

  try {
    // 1. Fetch the audio blob from the URL
    const audioRes = await fetch(audioUrl);
    const audioBlob = await audioRes.blob();
    const arrayBuffer = await audioBlob.arrayBuffer();
    const base64Audio = Buffer.from(arrayBuffer).toString('base64');

    // 2. Call Bhashini Inference (Example standard structure)
    // You may need to adjust the exact endpoint and payload depending on your specific Bhashini access
    const response = await fetch('https://dhruva-api.bhashini.gov.in/services/inference/pipeline', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': apiKey,
        'userID': userId
      },
      body: JSON.stringify({
        pipelineTasks: [
          {
            taskType: "asr",
            config: {
              language: {
                sourceLanguage: "hi"
              },
              serviceId: pipelineId,
              audioFormat: "webm"
            }
          }
        ],
        inputData: {
          audio: [
            {
              audioContent: base64Audio
            }
          ]
        }
      })
    });

    if (!response.ok) {
      throw new Error(`Bhashini API error: ${response.statusText}`);
    }

    const data = await response.json();
    
    // Extract transcript from Bhashini response structure
    const transcript = data?.pipelineResponse?.[0]?.output?.[0]?.source || "";
    
    if (!transcript) throw new Error("Empty transcript returned");
    
    return transcript;

  } catch (error) {
    console.error('Bhashini transcription failed:', error);
    // Fallback so the pipeline doesn't break
    return "यह एक सुंदर हस्तनिर्मित उत्पाद है।"; 
  }
}
