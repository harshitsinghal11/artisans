'use server'

import { createClient } from '@/src/lib/supabase/server'
import { redis } from '@/src/lib/redis'
import { revalidatePath } from 'next/cache'

export async function publishProductAction(productId: string, data: {
  suggested_price: number
  description_en: string
  description_hi: string
}) {
  const supabase = await createClient()

  const { data: userData, error: authError } = await supabase.auth.getUser()
  if (authError || !userData?.user) {
    throw new Error('Unauthorized')
  }

  const { error: dbError } = await supabase
    .from('products')
    .update({
      suggested_price: data.suggested_price,
      description_en: data.description_en,
      description_hi: data.description_hi,
      status: 'published',
    })
    .eq('id', productId)
    .eq('user_id', userData.user.id)

  if (dbError) {
    throw new Error(dbError.message)
  }

  if (process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL) {
    try {
      await redis.del('feed:products')
      await redis.del(`dashboard:products:${userData.user.id}`)
      await redis.del(`catalog:products:${userData.user.id}`)
      await redis.del('dashboard:totalPublished')
    } catch (error) {
      console.warn('Failed to invalidate Redis cache on publish:', error)
    }
  }

  revalidatePath('/dashboard')
  revalidatePath('/feed')
  revalidatePath('/catalog')

  return { success: true }
}
