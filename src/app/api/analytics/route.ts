import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// Simple in-memory cache for analytics data
const analyticsCache: {
  data: Record<string, unknown> | null;
  timestamp: number;
} = {
  data: null,
  timestamp: 0,
};

const CACHE_DURATION = 60 * 1000; // 1 minute cache

// Simple rate limiter
const rateLimitMap = new Map<string, { count: number; timestamp: number }>();
const RATE_LIMIT_WINDOW = 10 * 1000; // 10 seconds
const RATE_LIMIT_MAX = 5; // Max 5 requests per window

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const record = rateLimitMap.get(ip);
  
  if (!record || now - record.timestamp > RATE_LIMIT_WINDOW) {
    rateLimitMap.set(ip, { count: 1, timestamp: now });
    return false;
  }
  
  if (record.count >= RATE_LIMIT_MAX) {
    return true;
  }
  
  record.count++;
  return false;
}

// GET /api/analytics - Get dashboard analytics
export async function GET(request: NextRequest) {
  // Get client IP for rate limiting
  const ip = request.headers.get('x-forwarded-for') || 
             request.headers.get('x-real-ip') || 
             'unknown';
  
  // Check rate limit
  if (isRateLimited(ip)) {
    return NextResponse.json(
      { error: 'Too many requests. Please wait a moment.' },
      { status: 429 }
    );
  }

  try {
    // Check cache first
    if (analyticsCache.data && Date.now() - analyticsCache.timestamp < CACHE_DURATION) {
      return NextResponse.json(analyticsCache.data);
    }

    const { searchParams } = new URL(request.url);
    const period = parseInt(searchParams.get('period') || '30'); // days

    const currentDate = new Date();
    const startDate = new Date(currentDate.getTime() - period * 24 * 60 * 60 * 1000);
    const sevenDaysAgo = new Date(currentDate.getTime() - 7 * 24 * 60 * 60 * 1000);

    // Get counts for entity stats
    const [
      totalCategories,
      totalProducts,
      totalCertificates,
      totalExportRequests,
      recentExportRequests,
    ] = await Promise.all([
      prisma.category.count({ where: { isActive: true } }),
      prisma.product.count({ where: { isActive: true } }),
      prisma.certificate.count({ where: { isActive: true } }),
      prisma.exportRequest.count(),
      prisma.exportRequest.count({ where: { createdAt: { gte: sevenDaysAgo } } }),
    ]);

    // Get page views from database (grouped by page name)
    const pageViewsByPage = await prisma.pageView.groupBy({
      by: ['pageName'],
      _count: true,
      where: {
        createdAt: { gte: startDate },
        pageName: { not: null },
      },
      orderBy: { _count: { pageName: 'desc' } },
      take: 10,
    });

    // Get product views (dynamic pages with resourceType = 'product')
    const productViews = await prisma.pageView.groupBy({
      by: ['resourceSlug', 'pageName'],
      _count: true,
      where: {
        createdAt: { gte: startDate },
        pageType: 'DYNAMIC',
        resourceType: 'product',
      },
      orderBy: { _count: { resourceSlug: 'desc' } },
      take: 5,
    });

    // Get country statistics from page views
    const countryStatsFromViews = await prisma.pageView.groupBy({
      by: ['country'],
      _count: true,
      where: {
        createdAt: { gte: startDate },
        country: { not: null },
      },
      orderBy: { _count: { country: 'desc' } },
      take: 10,
    });

    // Get monthly page views for the last 6 months
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
    
    const monthlyPageViews = await prisma.pageView.findMany({
      where: {
        createdAt: { gte: sixMonthsAgo },
      },
      select: {
        createdAt: true,
      },
    });

    // Process monthly data
    const monthlyMap = new Map<string, number>();
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    // Initialize all 6 months with 0
    for (let i = 5; i >= 0; i--) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      const monthKey = months[date.getMonth()];
      monthlyMap.set(monthKey, 0);
    }
    
    // Count views per month
    monthlyPageViews.forEach(view => {
      const monthKey = months[view.createdAt.getMonth()];
      const count = monthlyMap.get(monthKey) || 0;
      monthlyMap.set(monthKey, count + 1);
    });

    // Convert to array maintaining order
    const monthlyRequests: { month: string; requests: number }[] = [];
    for (let i = 5; i >= 0; i--) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      const monthKey = months[date.getMonth()];
      monthlyRequests.push({
        month: monthKey,
        requests: monthlyMap.get(monthKey) || 0,
      });
    }

    // Get additional device/browser stats
    const deviceStats = await prisma.pageView.groupBy({
      by: ['device'],
      _count: true,
      where: {
        createdAt: { gte: startDate },
        device: { not: null },
      },
      orderBy: { _count: { device: 'desc' } },
    });

    const browserStats = await prisma.pageView.groupBy({
      by: ['browser'],
      _count: true,
      where: {
        createdAt: { gte: startDate },
        browser: { not: null },
      },
      orderBy: { _count: { browser: 'desc' } },
      take: 5,
    });

    // Get total page views count
    const totalPageViews = await prisma.pageView.count({
      where: { createdAt: { gte: startDate } },
    });

    // Format data for response
    const pageViews = pageViewsByPage.map((item) => ({
      name: item.pageName || 'Unknown',
      value: item._count,
    }));

    const productViewsFormatted = productViews.map((item) => ({
      name: item.pageName || item.resourceSlug || 'Unknown',
      views: item._count,
    }));

    const countryStats = countryStatsFromViews
      .filter(item => item.country && item.country !== 'Local')
      .map((item) => ({
        country: item.country || 'Unknown',
        requests: item._count,
      }));

    const responseData = {
      // Stats for AdminOverview
      stats: {
        totalProducts,
        totalCategories,
        totalCertificates,
        totalRequests: totalExportRequests,
        recentRequests: recentExportRequests,
        totalPageViews,
      },
      // Data for AdminAnalytics charts
      pageViews,
      productViews: productViewsFormatted,
      countryStats,
      monthlyRequests,
      // Additional stats
      deviceStats: deviceStats.map(d => ({ device: d.device, count: d._count })),
      browserStats: browserStats.map(b => ({ browser: b.browser, count: b._count })),
    };

    // Update cache
    analyticsCache.data = responseData;
    analyticsCache.timestamp = Date.now();

    return NextResponse.json(responseData);
  } catch (error) {
    console.error('Error fetching analytics:', error);
    return NextResponse.json(
      { error: 'Failed to fetch analytics' },
      { status: 500 }
    );
  }
}
