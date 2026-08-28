import { generateObject } from 'ai'
import { google } from '@ai-sdk/google'
import { mistral } from '@ai-sdk/mistral'
import { z } from 'zod'

export const productOutputSchema = z.object({
  description_en: z
    .string()
    .describe('Very simple, easy-to-understand English description highlighting craftsmanship. Use basic conversational vocabulary.'),
  description_hi: z
    .string()
    .describe('Natural-sounding, very simple Hindi translation of the description using common words.'),
  suggested_price: z.number().describe('Suggested retail price in INR.'),
  price_reasoning: z
    .string()
    .describe('Brief explanation of why this price was chosen based on visual details and material cost.'),
})

export type ProductOutput = z.infer<typeof productOutputSchema>

export async function processProductAI(
  imageUrl: string,
  transcript: string,
  materialCost: number,
  category: string
): Promise<ProductOutput> {
  const prompt = `
    You are an expert e-commerce copywriter.

    First, carefully analyze the provided product image to determine exactly what the physical item is. 
    Then, using the image and the artisan's voice note, write a product description.
    
    CRITICAL: Do not invent or assume the product's purpose. If the image shows a modern item (e.g., mobile cover), describe it as such. Do not force it into a "handmade home decor" category unless it actually is.
    Your writing must be extremely simple, easy to read, and conversational. Do not use advanced vocabulary or complex English/Hindi words. Write as if you are explaining it to a layperson.

    Category: ${category}
    Raw Material Cost: ₹${materialCost}
    Artisan's Voice Note (translated/transcribed): "${transcript}"
  `

  try {
    const { object } = await generateObject({
      model: google('gemini-1.5-pro'),
      schema: productOutputSchema,
      messages: [
        {
          role: 'user',
          content: [
            { type: 'text', text: prompt },
            { type: 'image', image: new URL(imageUrl) },
          ],
        },
      ],
    })

    return object
  } catch (error) {
    console.warn('Gemini AI failed, falling back to Mistral API...', error)

    const { object } = await generateObject({
      model: mistral('mistral-large-latest'),
      schema: productOutputSchema,
      prompt:
        prompt +
        `\n\nNote: The image analysis failed. Base the pricing and description purely on the category (${category}) and the artisan's voice note.`,
    })

    return object
  }
}
