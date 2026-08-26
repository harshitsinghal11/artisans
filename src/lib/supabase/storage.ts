import { createClient } from '@/src/lib/supabase/client'
import { v4 as uuidv4 } from 'uuid'

/**
 * Uploads a file to a specified Supabase Storage bucket.
 * Automatically generates a unique UUID filename to prevent collisions.
 * 
 * @param bucketName The name of the storage bucket
 * @param file The file to upload
 * @param extension The file extension (e.g., 'jpg', 'webm')
 * @returns The public URL of the uploaded file
 */
export async function uploadFileToStorage(
  bucketName: string, 
  file: File, 
  extension: string
): Promise<{ url: string | null; error: Error | null }> {
  try {
    const supabase = createClient()
    const fileName = `${uuidv4()}.${extension}`
    const filePath = `${fileName}`

    const { error: uploadError } = await supabase.storage
      .from(bucketName)
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      })

    if (uploadError) {
      throw uploadError
    }

    const { data } = supabase.storage
      .from(bucketName)
      .getPublicUrl(filePath)

    return { url: data.publicUrl, error: null }
  } catch (err: any) {
    console.error(`Error uploading to ${bucketName}:`, err.message)
    return { url: null, error: err as Error }
  }
}
