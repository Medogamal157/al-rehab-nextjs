import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// Interface for geo data from ip-api.com (free tier)
interface GeoData {
  country?: string;
  city?: string;
  regionName?: string;
  status?: string;
}

// Parse user agent to extract device, browser, and OS
function parseUserAgent(userAgent: string | null): { device: string; browser: string; os: string } {
  if (!userAgent) {
    return { device: 'unknown', browser: 'unknown', os: 'unknown' };
  }

  // Detect device
  let device = 'desktop';
  if (/mobile/i.test(userAgent)) {
    device = 'mobile';
  } else if (/tablet|ipad/i.test(userAgent)) {
    device = 'tablet';
  }

  // Detect browser
  let browser = 'unknown';
  if (/chrome/i.test(userAgent) && !/edg/i.test(userAgent)) {
    browser = 'Chrome';
  } else if (/firefox/i.test(userAgent)) {
    browser = 'Firefox';
  } else if (/safari/i.test(userAgent) && !/chrome/i.test(userAgent)) {
    browser = 'Safari';
  } else if (/edg/i.test(userAgent)) {
    browser = 'Edge';
  } else if (/opera|opr/i.test(userAgent)) {
    browser = 'Opera';
  }

  // Detect OS
  let os = 'unknown';
  if (/windows/i.test(userAgent)) {
    os = 'Windows';
  } else if (/macintosh|mac os/i.test(userAgent)) {
    os = 'MacOS';
  } else if (/linux/i.test(userAgent)) {
    os = 'Linux';
  } else if (/iphone|ipad/i.test(userAgent)) {
    os = 'iOS';
  } else if (/android/i.test(userAgent)) {
    os = 'Android';
  }

  return { device, browser, os };
}

// Get geo location from IP using free ip-api.com service
async function getGeoFromIP(ip: string): Promise<GeoData> {
  // Skip for local/private IPs
  if (ip === 'unknown' || ip === '127.0.0.1' || ip === '::1' || ip.startsWith('192.168.') || ip.startsWith('10.')) {
    return { country: 'Local', city: 'Local', regionName: 'Local' };
  }

  try {
    // Using ip-api.com free tier (limited to 45 requests per minute)
    // For production, consider using a paid service or caching results
    const response = await fetch(`http://ip-api.com/json/${ip}?fields=status,country,regionName,city`, {
      signal: AbortSignal.timeout(2000), // 2 second timeout
    });
    
    if (!response.ok) {
      return {};
    }
    
    const data = await response.json();
    if (data.status === 'success') {
      return {
        country: data.country,
        city: data.city,
        regionName: data.regionName,
      };
    }
    return {};
  } catch {
    // Don't let geo lookup failure affect tracking
    return {};
  }
}

// Generate a simple session ID (for grouping page views)
function generateSessionId(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

// POST /api/analytics/track - Record a page view (async, non-blocking)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const {
      path,
      pageName,
      pageType = 'STATIC',
      resourceType,
      resourceId,
      resourceSlug,
      sessionId,
      referer,
    } = body;

    // Validate required fields
    if (!path) {
      return NextResponse.json(
        { error: 'Path is required' },
        { status: 400 }
      );
    }

    // Get visitor information from headers
    const ipAddress = request.headers.get('x-forwarded-for')?.split(',')[0].trim() || 
                      request.headers.get('x-real-ip') || 
                      'unknown';
    const userAgent = request.headers.get('user-agent');
    const requestReferer = referer || request.headers.get('referer');

    // Parse user agent
    const { device, browser, os } = parseUserAgent(userAgent);

    // Get geo data (this is async but we don't block on it for the response)
    // We'll do a "fire and forget" approach for the geo lookup
    const geoPromise = getGeoFromIP(ipAddress);

    // Create page view record
    // We use a background approach - start the database write but don't wait for geo
    const createPageView = async () => {
      const geoData = await geoPromise;
      
      await prisma.pageView.create({
        data: {
          path,
          pageName: pageName || getPageNameFromPath(path),
          pageType: pageType === 'DYNAMIC' ? 'DYNAMIC' : 'STATIC',
          resourceType,
          resourceId,
          resourceSlug,
          ipAddress,
          country: geoData.country,
          city: geoData.city,
          region: geoData.regionName,
          userAgent,
          referer: requestReferer,
          device,
          browser,
          os,
          sessionId: sessionId || generateSessionId(),
        },
      });
    };

    // Execute the database write without blocking the response
    // This ensures the tracking doesn't slow down page loads
    createPageView().catch((error) => {
      console.error('Failed to record page view:', error);
    });

    // Return immediately
    return NextResponse.json({ success: true }, { status: 202 });
  } catch (error) {
    console.error('Error in analytics tracking:', error);
    // Even on error, return success to not affect the user experience
    return NextResponse.json({ success: true }, { status: 202 });
  }
}

// Helper to derive page name from path
function getPageNameFromPath(path: string): string {
  const pathMap: Record<string, string> = {
    '/': 'Home',
    '/about': 'About',
    '/products': 'Products',
    '/certificates': 'Certificates',
    '/contact': 'Contact',
    '/farms': 'Farms',
    '/quality-control': 'Quality Control',
    '/shipments': 'Shipments',
    '/privacy-policy': 'Privacy Policy',
    '/terms-of-service': 'Terms of Service',
    '/export-terms': 'Export Terms',
  };

  // Check exact match
  if (pathMap[path]) {
    return pathMap[path];
  }

  // Check for dynamic routes
  if (path.startsWith('/products/')) {
    return 'Product Details';
  }
  if (path.startsWith('/certificates/')) {
    return 'Certificate Details';
  }

  // Default: capitalize the path
  const segment = path.split('/').filter(Boolean).pop() || 'Unknown';
  return segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, ' ');
}

// OPTIONS handler for CORS preflight
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
