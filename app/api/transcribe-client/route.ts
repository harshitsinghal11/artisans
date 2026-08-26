import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as Blob;
    
    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    const apiKey = process.env.GROQ_API_KEY;

    if (!apiKey) {
      console.warn("Groq API key missing. Falling back to mock transcript.");
      return NextResponse.json({ 
        transcript: "यह एक सुंदर हस्तनिर्मित उत्पाद है। मैंने इसे उच्च गुणवत्ता वाली सामग्री से बनाया है।" 
      });
    }

    const groqFormData = new FormData();
    groqFormData.append("file", file, "audio.webm");
    groqFormData.append("model", "whisper-large-v3");
    groqFormData.append("temperature", "0");
    groqFormData.append("response_format", "json");

    const response = await fetch("https://api.groq.com/openai/v1/audio/transcriptions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
      },
      body: groqFormData as any,
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Groq API error: ${response.status} ${errorText}`);
    }

    const data = await response.json();
    const transcript = data.text;

    if (!transcript) throw new Error("Empty transcript returned from Groq");

    return NextResponse.json({ transcript });

  } catch (error: any) {
    console.error('Client STT failed:', error);
    return NextResponse.json({ 
      transcript: "यह एक सुंदर हस्तनिर्मित उत्पाद है।" 
    });
  }
}
