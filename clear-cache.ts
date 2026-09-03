import { redis } from './src/lib/redis'

async function clearCache() {
  console.log('Clearing cache...')
  await redis.flushdb()
  console.log('Cleared all redis cache')
}

clearCache().catch(console.error)
