import { LRUCache } from 'lru-cache'

type Options = {
  uniqueTokenPerInterval?: number
  interval?: number
}

export default function rateLimit(options: Options = {}) {
  const tokenCache = new LRUCache({
    max: options.uniqueTokenPerInterval || 500,
    ttl: options.interval || 60000,
  })

  return {
    check: (request: Request, limit: number, token?: string) =>
      new Promise<void>((resolve, reject) => {
        const tokenIdentifier = token || getIP(request) || 'anonymous'
        const tokenCount = (tokenCache.get(tokenIdentifier) as number[]) || [0]
        
        if (tokenCount[0] === 0) {
          tokenCache.set(tokenIdentifier, tokenCount)
        }
        
        tokenCount[0] += 1

        const currentUsage = tokenCount[0]
        const isRateLimited = currentUsage >= limit

        if (isRateLimited) {
          reject(new Error('Rate limit exceeded'))
        } else {
          resolve()
        }
      }),
  }
}

function getIP(request: Request): string | null {
  const forwarded = request.headers.get('x-forwarded-for')
  if (forwarded) {
    return forwarded.split(',')[0].trim()
  }
  
  const realIP = request.headers.get('x-real-ip')
  if (realIP) {
    return realIP.trim()
  }
  
  return request.headers.get('cf-connecting-ip') || null
}