import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { NextRequest } from 'next/server';

const { mockPrisma, mockAdmin } = vi.hoisted(() => ({
  mockPrisma: {
    category: { count: vi.fn() },
    product: { count: vi.fn() },
    certificate: { count: vi.fn() },
    exportRequest: { count: vi.fn() },
    pageView: {
      groupBy: vi.fn(),
      findMany: vi.fn(),
      count: vi.fn(),
    },
  },
  mockAdmin: vi.fn(),
}));

vi.mock('@/lib/prisma', () => ({
  prisma: mockPrisma,
  default: mockPrisma,
}));

vi.mock('@/lib/admin-auth', () => ({
  verifyAdminToken: (...args: unknown[]) => mockAdmin(...args),
}));

import { GET } from '@/app/api/analytics/route';

let ipCounter = 0;
function makeRequest(query = ''): NextRequest {
  // Unique IP per request to avoid the route's internal per-IP rate limiter.
  ipCounter += 1;
  return new Request(`http://localhost/api/analytics${query}`, {
    headers: { 'x-forwarded-for': `10.0.0.${ipCounter}` },
  }) as unknown as NextRequest;
}

function resetCounts() {
  mockPrisma.category.count.mockResolvedValue(1);
  mockPrisma.product.count.mockResolvedValue(2);
  mockPrisma.certificate.count.mockResolvedValue(3);
  mockPrisma.exportRequest.count.mockResolvedValue(4);
  mockPrisma.pageView.groupBy.mockResolvedValue([]);
  mockPrisma.pageView.findMany.mockResolvedValue([]);
  mockPrisma.pageView.count.mockResolvedValue(0);
}

describe('GET /api/analytics (date range + cache)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockAdmin.mockResolvedValue({ id: 'admin-1', email: 'admin@test.com' });
    resetCounts();
  });

  it('returns 401 when not authenticated', async () => {
    mockAdmin.mockResolvedValue(null);

    const res = await GET(makeRequest('?period=30'));

    expect(res.status).toBe(401);
  });

  it('applies a gte/lte date range to page-view queries', async () => {
    await GET(makeRequest('?period=7'));

    const where = mockPrisma.pageView.count.mock.calls[0][0].where;
    expect(where.createdAt.gte).toBeInstanceOf(Date);
    expect(where.createdAt.lte).toBeInstanceOf(Date);
    // 7-day window: start is roughly 7 days before end.
    const days = (where.createdAt.lte.getTime() - where.createdAt.gte.getTime()) / 86_400_000;
    expect(Math.round(days)).toBe(7);
  });

  it('honors explicit from/to and includes the whole end day', async () => {
    await GET(makeRequest('?from=2024-01-10&to=2024-01-20'));

    const where = mockPrisma.pageView.count.mock.calls[0][0].where;
    expect(where.createdAt.gte.getTime()).toBe(new Date('2024-01-10').getTime());
    // End date should be pushed to 23:59:59.999 of the to-day.
    expect(where.createdAt.lte.getHours()).toBe(23);
    expect(where.createdAt.lte.getMinutes()).toBe(59);
  });

  it('serves identical ranges from cache (no duplicate DB hit)', async () => {
    // Unique fixed range so this test owns its cache key.
    const range = '?from=2031-05-01&to=2031-05-10';

    await GET(makeRequest(range));
    const callsAfterFirst = mockPrisma.pageView.count.mock.calls.length;
    expect(callsAfterFirst).toBe(1);

    await GET(makeRequest(range));
    // Second identical request should hit the cache, not the DB again.
    expect(mockPrisma.pageView.count.mock.calls.length).toBe(1);
  });

  it('returns the expected response shape', async () => {
    const res = await GET(makeRequest('?from=2030-01-01&to=2030-01-15'));
    const body = await res.json();

    expect(body).toHaveProperty('stats');
    expect(body.stats).toMatchObject({
      totalProducts: 2,
      totalCategories: 1,
      totalCertificates: 3,
    });
    expect(body).toHaveProperty('pageViews');
    expect(body).toHaveProperty('countryStats');
    expect(body).toHaveProperty('monthlyRequests');
  });
});
