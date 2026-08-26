import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { enhanceImage } from '@/src/lib/ai/cloudinary';
import { transcribeAudio } from '@/src/lib/ai/groq';
import { processProductAI } from '@/src/lib/ai/gemini';

// Initialize Supabase Admin client to bypass RLS for background processing
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

export async function POST(req: Request) {
  try {
    const { productId } = await req.json();

    if (!productId) {
      return NextResponse.json({ error: 'Product ID is required' }, { status: 400 });
    }

    // 1. Fetch raw data from Supabase
    const { data: product, error: fetchError } = await supabaseAdmin
      .from('products')
      .select('*')
      .eq('id', productId)
      .single();

    if (fetchError || !product) {
      throw new Error(`Failed to fetch product: ${fetchError?.message}`);
    }

    // 2. Enhance Image (Cloudinary)
    const enhancedImageUrl = await enhanceImage(product.raw_image_url);

    // 3. Transcribe Audio (Groq Whisper)
    const transcript = await transcribeAudio(product.raw_audio_url);

    // 4. Vision & Pricing Engine (Vercel AI SDK with fallback)
    const aiOutput = await processProductAI(
      enhancedImageUrl,
      transcript,
      product.material_cost,
      product.category
    );

    // 5. Update Database
    const { error: updateError } = await supabaseAdmin
      .from('products')
      .update({
        enhanced_image_url: enhancedImageUrl,
        transcript: transcript,
        description_en: aiOutput.description_en,
        description_hi: aiOutput.description_hi,
        suggested_price: aiOutput.suggested_price,
        price_reasoning: aiOutput.price_reasoning,
        status: 'ready_for_review'
      })
      .eq('id', productId);

    if (updateError) {
      throw new Error(`Failed to update product: ${updateError.message}`);
    }

    return NextResponse.json({ success: true, data: aiOutput });

  } catch (error: any) {
    console.error('Orchestration error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
