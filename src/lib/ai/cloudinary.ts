import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary. It automatically picks up CLOUDINARY_URL from the environment.
// We explicitly check if it's valid to prevent crashes.
const isCloudinaryConfigured = process.env.CLOUDINARY_URL && process.env.CLOUDINARY_URL.startsWith('cloudinary://');

if (isCloudinaryConfigured) {
  cloudinary.config({
    secure: true,
  });
}

/**
 * Uploads an image to Cloudinary and requests background removal and auto-color.
 * 
 * @param imageUrl The public URL of the raw image from Supabase Storage
 * @returns The URL of the enhanced image
 */
export async function enhanceImage(imageUrl: string): Promise<string> {
  if (!isCloudinaryConfigured) {
    console.warn('CLOUDINARY_URL is missing or invalid in .env. Skipping enhancement and returning original image.');
    return imageUrl;
  }

  try {
    const result = await cloudinary.uploader.upload(imageUrl, {
      // Cloudinary AI Background Removal add-on must be enabled
      background_removal: 'cloudinary_ai', 
      // Auto color correction
      effect: 'auto_color',
      folder: 'artisans_enhanced'
    });

    return result.secure_url;
  } catch (error) {
    console.error('Cloudinary enhancement failed:', error);
    // Fallback: return the original image URL if enhancement fails
    // This ensures the pipeline doesn't break during a live demo
    return imageUrl;
  }
}
