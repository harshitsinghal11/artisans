import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'
import { z } from 'zod'
import { processProductAI } from '@/src/lib/ai/gemini'
import { enhanceImage } from '@/src/lib/ai/cloudinary'
import { transcribeAudio } from '@/src/lib/ai/groq'
import { getErrorMessage } from '@/src/lib/errors'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const payloadSchema = z.object({
  productId: z.string().uuid(),
  removeBackground: z.boolean().default(true),
})

export async function POST(req: Request) {
  try {
    const payload = payloadSchema.safeParse(await req.json())

    if (!payload.success) {
      return NextResponse.json({ error: 'Valid product ID is required.' }, { status: 400 })
    }

    const { productId, removeBackground } = payload.data

    const { data: product, error: fetchError } = await supabaseAdmin
      .from('products')
      .select('id, raw_image_url, raw_audio_url, material_cost, category')
      .eq('id', productId)
      .single()

    if (fetchError || !product) {
      throw new Error(`Failed to fetch product: ${fetchError?.message ?? 'missing record'}`)
    }

    const enhancedImageUrl = removeBackground
      ? await enhanceImage(product.raw_image_url)
      : product.raw_image_url
    const transcript = await transcribeAudio(product.raw_audio_url)
    const aiOutput = await processProductAI(
      enhancedImageUrl,
      transcript,
      Number(product.material_cost),
      product.category
    )

    const { error: updateError } = await supabaseAdmin
      .from('products')
      .update({
        enhanced_image_url: enhancedImageUrl,
        transcript,
        description_en: aiOutput.description_en,
        description_hi: aiOutput.description_hi,
        suggested_price: aiOutput.suggested_price,
        price_reasoning: aiOutput.price_reasoning,
        status: 'ready_for_review',
      })
      .eq('id', productId)

    if (updateError) {
      throw new Error(`Failed to update product: ${updateError.message}`)
    }

    return NextResponse.json({ success: true, data: aiOutput })
  } catch (error: unknown) {
    console.error('Orchestration error:', error)
    return NextResponse.json({ error: getErrorMessage(error) }, { status: 500 })
  }
}
