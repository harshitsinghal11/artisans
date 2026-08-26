import { GoogleGenerativeAI, SchemaType } from "@google/generative-ai";
import { z } from "zod";

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export const productOutputSchema = z.object({
  description_en: z.string(),
  description_hi: z.string(),
  suggested_price: z.number(),
  price_reasoning: z.string(),
});

export type ProductOutput = z.infer<typeof productOutputSchema>;

/**
 * Converts an image URL to the inlineData format required by Gemini Vision.
 */
async function urlToGenerativePart(url: string, mimeType: string) {
  const response = await fetch(url);
  const buffer = await response.arrayBuffer();
  return {
    inlineData: {
      data: Buffer.from(buffer).toString("base64"),
      mimeType
    },
  };
}

export async function processProductWithGemini(
  imageUrl: string,
  transcript: string,
  materialCost: number,
  category: string
): Promise<ProductOutput> {

  const model = genAI.getGenerativeModel({
    model: "gemini-3.7-flash",
    generationConfig: {
      responseMimeType: "application/json",
      responseSchema: {
        type: SchemaType.OBJECT,
        properties: {
          description_en: { type: SchemaType.STRING },
          description_hi: { type: SchemaType.STRING },
          suggested_price: { type: SchemaType.NUMBER },
          price_reasoning: { type: SchemaType.STRING },
        },
        required: ["description_en", "description_hi", "suggested_price", "price_reasoning"],
      },
    },
  });

  const prompt = `
    You are an expert e-commerce copywriter and pricing strategist helping rural artisans sell their handmade goods.
    
    Category: ${category}
    Raw Material Cost: ₹${materialCost}
    Artisan's Voice Note (translated/transcribed): "${transcript}"

    Analyze the provided product image and the artisan's voice note.
    
    Tasks:
    1. Write a beautiful, SEO-friendly English description (description_en). Highlight the craftsmanship and cultural significance.
    2. Translate the description into natural-sounding Hindi (description_hi).
    3. Suggest a retail price (suggested_price) in INR. Use the material cost as a baseline, but increase it based on the visual quality, intricacy of work, and market positioning for handmade goods.
    4. Provide a brief explanation (price_reasoning) of why you chose this price, referencing specific visual details from the image and the material cost.
  `;

  // Assuming Cloudinary returns jpgs. You can derive this from the URL if needed.
  const imagePart = await urlToGenerativePart(imageUrl, "image/jpeg");

  const result = await model.generateContent([prompt, imagePart]);
  const responseText = result.response.text();

  const parsedJson = JSON.parse(responseText);

  // Validate against Zod schema to ensure type safety
  return productOutputSchema.parse(parsedJson);
}
