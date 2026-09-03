import { NextResponse } from 'next/server'
import { createClient } from '@/src/lib/supabase/server'
import { redis } from '@/src/lib/redis'
import { z } from 'zod'

const payloadSchema = z.object({
  productId: z.string().uuid(),
})

export async function POST(req: Request) {
  try {
    const json = await req.json()
    const payload = payloadSchema.safeParse(json)

    if (!payload.success) {
      return NextResponse.json({ error: 'Valid product ID is required.' }, { status: 400 })
    }

    const { productId } = payload.data
    const supabase = await createClient()

    // Get current user session
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()

    if (userError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Delete the product if it belongs to the user
    const { error: deleteError } = await supabase
      .from('products')
      .delete()
      .eq('id', productId)
      .eq('user_id', user.id)

    if (deleteError) {
      return NextResponse.json(
        { error: `Failed to delete product: ${deleteError.message}` },
        { status: 500 }
      )
    }

    if (process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL) {
      try {
        await redis.del('feed:products')
        await redis.del(`dashboard:products:${user.id}`)
        await redis.del(`catalog:products:${user.id}`)
        await redis.del('dashboard:totalPublished')
      } catch (e) {
        console.warn('Failed to invalidate Redis cache on delete:', e)
      }
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting product:', error)
    return NextResponse.json(
      { error: 'An unexpected error occurred while deleting the product.' },
      { status: 500 }
    )
  }
}
