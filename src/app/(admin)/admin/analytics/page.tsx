import type { Metadata } from 'next';
import { AdminAnalytics } from '@/components/admin/AdminAnalytics';
import { verifyAdminAuth } from '@/lib/admin-auth-server';
import prisma from '@/lib/prisma';

export const metadata: Metadata = {
  title: 'Analytics | Al-Rehab Admin',
  description: 'Analytics dashboard for Al-Rehab Group',
  robots: {
    index: false,
    follow: false,
  },
};

// Disable caching for analytics page
export const dynamic = 'force-dynamic';

// Fetch analytics data server-side
async function getAnalyticsData() {
  try {
    const currentDate = new Date();
    const thirtyDaysAgo = new Date(currentDate.getTime() - 30 * 24 * 60 * 60 * 1000);
    const sevenDaysAgo = new Date(currentDate.getTime() - 7 * 24 * 60 * 60 * 1000);
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    // Get basic entity counts
    const [productsCount, categoriesCount, certificatesCount, requestsCount, recentRequestsCount] = await Promise.all([
      prisma.product.count(),
      prisma.category.count(),
      prisma.certificate.count(),
      prisma.exportRequest.count(),
      prisma.exportRequest.count({ where: { createdAt: { gte: sevenDaysAgo } } }),
    ]);

    // Get real page views from database (grouped by page name)
    const pageViewsByPage = await prisma.pageView.groupBy({
      by: ['pageName'],
      _count: true,
      where: {
        createdAt: { gte: thirtyDaysAgo },
        pageName: { not: null },
      },
      orderBy: { _count: { pageName: 'desc' } },
      take: 10,
    });

    const pageViews = pageViewsByPage.map((item) => ({
      name: item.pageName || 'Unknown',
      value: item._count,
    }));

    // Get product views (dynamic pages with resourceType = 'product')
    const productViewsData = await prisma.pageView.groupBy({
      by: ['resourceSlug', 'pageName'],
      _count: true,
      where: {
        createdAt: { gte: thirtyDaysAgo },
        pageType: 'DYNAMIC',
        resourceType: 'product',
      },
      orderBy: { _count: { resourceSlug: 'desc' } },
      take: 5,
    });

    const productViews = productViewsData.map((item) => ({
      name: item.pageName || item.resourceSlug || 'Unknown',
      views: item._count,
    }));

    // Get country statistics from page views
    const countryStatsData = await prisma.pageView.groupBy({
      by: ['country'],
      _count: true,
      where: {
        createdAt: { gte: thirtyDaysAgo },
        country: { not: null },
      },
      orderBy: { _count: { country: 'desc' } },
      take: 10,
    });

    const countryStats = countryStatsData
      .filter(item => item.country && item.country !== 'Local')
      .map((item) => ({
        country: item.country || 'Unknown',
        requests: item._count,
      }));

    // Get monthly page views for the last 6 months
    const monthlyPageViews = await prisma.pageView.findMany({
      where: {
        createdAt: { gte: sixMonthsAgo },
      },
      select: {
        createdAt: true,
      },
    });

    // Process monthly data
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const monthlyMap = new Map<string, number>();
    
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

    // Get device and browser stats
    const deviceStats = await prisma.pageView.groupBy({
      by: ['device'],
      _count: true,
      where: {
        createdAt: { gte: thirtyDaysAgo },
        device: { not: null },
      },
      orderBy: { _count: { device: 'desc' } },
    });

    const browserStats = await prisma.pageView.groupBy({
      by: ['browser'],
      _count: true,
      where: {
        createdAt: { gte: thirtyDaysAgo },
        browser: { not: null },
      },
      orderBy: { _count: { browser: 'desc' } },
      take: 5,
    });

    // Get total page views
    const totalPageViews = await prisma.pageView.count({
      where: { createdAt: { gte: thirtyDaysAgo } },
    });

    return {
      totalProducts: productsCount,
      totalCategories: categoriesCount,
      totalCertificates: certificatesCount,
      totalRequests: requestsCount,
      recentRequests: recentRequestsCount,
      totalPageViews,
      pageViews,
      productViews,
      countryStats,
      monthlyRequests,
      deviceStats: deviceStats.map(d => ({ device: d.device || 'unknown', count: d._count })),
      browserStats: browserStats.map(b => ({ browser: b.browser || 'unknown', count: b._count })),
    };
  } catch (error) {
    console.error('Failed to fetch analytics:', error);
    return {
      totalProducts: 0,
      totalCategories: 0,
      totalCertificates: 0,
      totalRequests: 0,
      recentRequests: 0,
      totalPageViews: 0,
      pageViews: [],
      productViews: [],
      countryStats: [],
      monthlyRequests: [],
      deviceStats: [],
      browserStats: [],
    };
  }
}

export default async function AdminAnalyticsPage() {
  // Verify authentication server-side
  await verifyAdminAuth();
  
  // Fetch data server-side
  const analyticsData = await getAnalyticsData();

  return <AdminAnalytics initialData={analyticsData} />;
}
