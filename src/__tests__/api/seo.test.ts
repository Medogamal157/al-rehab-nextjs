import { describe, it, expect, vi, beforeEach } from 'vitest';

const { mockPrisma } = vi.hoisted(() => ({
  mockPrisma: {
    category: { findMany: vi.fn() },
    product: { findMany: vi.fn() },
    certificate: { findMany: vi.fn() },
    contactInfo: { findUnique: vi.fn() },
  },
}));

vi.mock('@/lib/prisma', () => ({
  prisma: mockPrisma,
  default: mockPrisma,
}));

import robots from '@/app/robots';
import { GET as llmsGET } from '@/app/llms.txt/route';

describe('robots.ts (AI crawler access)', () => {
  it('allows the site to be crawled and exposes the sitemap', () => {
    const result = robots();
    const rules = Array.isArray(result.rules) ? result.rules : [result.rules];

    const wildcard = rules.find((r) => r.userAgent === '*');
    expect(wildcard?.allow).toBe('/');
    expect(result.sitemap).toContain('/sitemap.xml');
  });

  it('explicitly allows major AI crawlers (no longer blocks GPTBot)', () => {
    const result = robots();
    const rules = Array.isArray(result.rules) ? result.rules : [result.rules];

    for (const bot of ['GPTBot', 'PerplexityBot', 'Google-Extended', 'ClaudeBot']) {
      const rule = rules.find((r) =>
        Array.isArray(r.userAgent) ? r.userAgent.includes(bot) : r.userAgent === bot
      );
      expect(rule, `${bot} rule missing`).toBeDefined();
      expect(rule?.allow).toBe('/');
    }
  });

  it('keeps admin and API paths private for every rule', () => {
    const result = robots();
    const rules = Array.isArray(result.rules) ? result.rules : [result.rules];

    for (const rule of rules) {
      const disallow = Array.isArray(rule.disallow) ? rule.disallow : [rule.disallow];
      expect(disallow).toContain('/admin/');
      expect(disallow).toContain('/api/');
    }
  });
});

describe('GET /llms.txt', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockPrisma.category.findMany.mockResolvedValue([
      { name: 'Herbs & Spices', slug: 'herbs-spices', description: 'Aromatic herbs' },
    ]);
    mockPrisma.product.findMany.mockResolvedValue([
      { name: 'Chamomile', slug: 'chamomile', englishName: 'Chamomile', botanicalName: 'Matricaria' },
    ]);
    mockPrisma.certificate.findMany.mockResolvedValue([
      { name: 'EU Organic', slug: 'eu-organic', fullName: 'European Union Organic Certification' },
    ]);
    mockPrisma.contactInfo.findUnique.mockResolvedValue({
      companyName: 'Al-Rehab Group for Export',
      city: 'Faiyum',
      country: 'Egypt',
      email: 'info@al-rehabgroup.com',
    });
  });

  it('serves plain-text markdown with business summary and products', async () => {
    const res = await llmsGET();
    expect(res.headers.get('Content-Type')).toContain('text/plain');

    const text = await res.text();
    expect(text).toContain('# Al-Rehab Group for Export');
    expect(text).toContain('Chamomile');
    expect(text).toContain('EU Organic');
    expect(text).toContain('## Contact');
  });

  it('degrades gracefully when the database is unavailable', async () => {
    mockPrisma.category.findMany.mockRejectedValue(new Error('db down'));
    mockPrisma.product.findMany.mockRejectedValue(new Error('db down'));
    mockPrisma.certificate.findMany.mockRejectedValue(new Error('db down'));
    mockPrisma.contactInfo.findUnique.mockRejectedValue(new Error('db down'));

    const res = await llmsGET();
    const text = await res.text();

    expect(res.headers.get('Content-Type')).toContain('text/plain');
    expect(text).toContain('# Al-Rehab Group for Export');
  });
});
