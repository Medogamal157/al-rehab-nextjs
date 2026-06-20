import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { NextRequest } from 'next/server';

// Hoisted so the mock objects exist before the hoisted vi.mock factories run.
const { mockPrisma, mockAdmin } = vi.hoisted(() => ({
  mockPrisma: {
    exportRequest: {
      findMany: vi.fn(),
      count: vi.fn(),
      groupBy: vi.fn(),
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

vi.mock('@/lib/rate-limit', () => ({
  rateLimitApi: vi.fn(() => ({ success: true, remaining: 99, reset: Date.now() + 60000 })),
  getRateLimitHeaders: vi.fn(() => ({})),
}));

import { GET } from '@/app/api/export-requests/route';

function makeRequest(url: string): NextRequest {
  return new Request(url) as unknown as NextRequest;
}

describe('GET /api/export-requests (server-side pagination)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockAdmin.mockResolvedValue({ id: 'admin-1', email: 'admin@test.com' });
    mockPrisma.exportRequest.findMany.mockResolvedValue([]);
    mockPrisma.exportRequest.count.mockResolvedValue(0);
    mockPrisma.exportRequest.groupBy.mockResolvedValue([]);
  });

  it('returns 401 when not authenticated', async () => {
    mockAdmin.mockResolvedValue(null);

    const res = await GET(makeRequest('http://localhost/api/export-requests'));

    expect(res.status).toBe(401);
  });

  it('paginates with skip/take derived from page and limit', async () => {
    mockPrisma.exportRequest.findMany.mockResolvedValue([{ id: 'r1' }]);
    mockPrisma.exportRequest.count.mockResolvedValue(45);
    mockPrisma.exportRequest.groupBy.mockResolvedValue([{ status: 'NEW', _count: 5 }]);

    const res = await GET(makeRequest('http://localhost/api/export-requests?page=2&limit=10'));
    const body = await res.json();

    expect(mockPrisma.exportRequest.findMany).toHaveBeenCalledWith(
      expect.objectContaining({ skip: 10, take: 10, orderBy: { createdAt: 'desc' } })
    );
    expect(body.pagination).toEqual({ total: 45, page: 2, limit: 10, totalPages: 5 });
    expect(body.statusCounts).toEqual({ NEW: 5 });
  });

  it('builds a case-insensitive OR search filter', async () => {
    await GET(makeRequest('http://localhost/api/export-requests?search=acme'));

    const args = mockPrisma.exportRequest.findMany.mock.calls[0][0];
    expect(args.where.OR).toEqual(
      expect.arrayContaining([
        { companyName: { contains: 'acme', mode: 'insensitive' } },
        { contactName: { contains: 'acme', mode: 'insensitive' } },
        { email: { contains: 'acme', mode: 'insensitive' } },
        { country: { contains: 'acme', mode: 'insensitive' } },
      ])
    );
  });

  it('filters by status but ignores status=all', async () => {
    await GET(makeRequest('http://localhost/api/export-requests?status=NEW'));
    expect(mockPrisma.exportRequest.findMany.mock.calls[0][0].where.status).toBe('NEW');

    vi.clearAllMocks();
    mockAdmin.mockResolvedValue({ id: 'admin-1' });
    mockPrisma.exportRequest.findMany.mockResolvedValue([]);
    mockPrisma.exportRequest.count.mockResolvedValue(0);
    mockPrisma.exportRequest.groupBy.mockResolvedValue([]);

    await GET(makeRequest('http://localhost/api/export-requests?status=all'));
    expect(mockPrisma.exportRequest.findMany.mock.calls[0][0].where.status).toBeUndefined();
  });

  it('clamps limit to a maximum of 100', async () => {
    await GET(makeRequest('http://localhost/api/export-requests?limit=99999'));
    expect(mockPrisma.exportRequest.findMany.mock.calls[0][0].take).toBe(100);
  });

  it('defaults invalid page to 1', async () => {
    await GET(makeRequest('http://localhost/api/export-requests?page=-3'));
    expect(mockPrisma.exportRequest.findMany.mock.calls[0][0].skip).toBe(0);
  });
});
