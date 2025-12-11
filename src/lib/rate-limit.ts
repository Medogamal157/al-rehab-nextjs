import { prisma } from '@/lib/prisma';
import { NextRequest } from 'next/server';

interface RateLimitConfig {
  windowMs: number; // Time window in milliseconds
  maxRequests: number; // Maximum requests per window
}

const defaultConfig: RateLimitConfig = {
  windowMs: 60 * 1000, // 1 minute
  maxRequests: 60, // 60 requests per minute
};

const strictConfig: RateLimitConfig = {
  windowMs: 60 * 1000, // 1 minute
  maxRequests: 10, // 10 requests per minute (for auth endpoints)
};

const contactFormConfig: RateLimitConfig = {
  windowMs: 24 * 60 * 60 * 1000, // 24 hours
  maxRequests: 5, // 5 messages per day per IP/user
};

export async function rateLimit(
  request: NextRequest,
  endpoint: string,
  config: RateLimitConfig = defaultConfig
): Promise<{ success: boolean; remaining: number; reset: Date }> {
  const identifier = getIdentifier(request);
  const now = new Date();
  const windowStart = new Date(now.getTime() - config.windowMs);

  try {
    // Clean up expired rate limits
    await prisma.rateLimit.deleteMany({
      where: { expiresAt: { lt: now } },
    });

    // Get or create rate limit entry
    const existing = await prisma.rateLimit.findUnique({
      where: {
        identifier_endpoint: {
          identifier,
          endpoint,
        },
      },
    });

    if (existing) {
      // Check if within the same window
      if (existing.windowStart > windowStart) {
        // Same window - increment count
        if (existing.count >= config.maxRequests) {
          return {
            success: false,
            remaining: 0,
            reset: existing.expiresAt,
          };
        }

        const updated = await prisma.rateLimit.update({
          where: { id: existing.id },
          data: { count: existing.count + 1 },
        });

        return {
          success: true,
          remaining: config.maxRequests - updated.count,
          reset: existing.expiresAt,
        };
      } else {
        // New window - reset count
        const expiresAt = new Date(now.getTime() + config.windowMs);
        await prisma.rateLimit.update({
          where: { id: existing.id },
          data: {
            count: 1,
            windowStart: now,
            expiresAt,
          },
        });

        return {
          success: true,
          remaining: config.maxRequests - 1,
          reset: expiresAt,
        };
      }
    } else {
      // Create new rate limit entry
      const expiresAt = new Date(now.getTime() + config.windowMs);
      await prisma.rateLimit.create({
        data: {
          identifier,
          endpoint,
          count: 1,
          windowStart: now,
          expiresAt,
        },
      });

      return {
        success: true,
        remaining: config.maxRequests - 1,
        reset: expiresAt,
      };
    }
  } catch (error) {
    console.error('Rate limit error:', error);
    // On error, allow the request but log it
    return {
      success: true,
      remaining: config.maxRequests,
      reset: new Date(now.getTime() + config.windowMs),
    };
  }
}

function getIdentifier(request: NextRequest): string {
  // Try to get the real IP address from various headers
  const forwarded = request.headers.get('x-forwarded-for');
  const real = request.headers.get('x-real-ip');
  const cfConnecting = request.headers.get('cf-connecting-ip');

  if (cfConnecting) return cfConnecting;
  if (forwarded) return forwarded.split(',')[0].trim();
  if (real) return real;

  // Fallback to a default identifier
  return 'unknown';
}

export function rateLimitAuth(request: NextRequest, endpoint: string) {
  return rateLimit(request, endpoint, strictConfig);
}

export function rateLimitApi(request: NextRequest, endpoint: string) {
  return rateLimit(request, endpoint, defaultConfig);
}

export function rateLimitContactForm(request: NextRequest, endpoint: string) {
  return rateLimit(request, endpoint, contactFormConfig);
}

// Helper to create rate limit response headers
export function getRateLimitHeaders(remaining: number, reset: Date): HeadersInit {
  return {
    'X-RateLimit-Remaining': remaining.toString(),
    'X-RateLimit-Reset': reset.toISOString(),
  };
}
