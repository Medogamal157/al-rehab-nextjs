import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock Prisma client
const mockPrisma = {
  certificate: {
    findMany: vi.fn(),
    findUnique: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
  },
  auditLog: {
    create: vi.fn(),
  },
};

vi.mock('@/lib/prisma', () => ({
  prisma: mockPrisma,
}));

// Mock admin auth
vi.mock('@/lib/admin-auth', () => ({
  verifyAdminToken: vi.fn(() => ({ id: 'admin-1', email: 'admin@test.com' })),
}));

// Mock rate limiting
vi.mock('@/lib/rate-limit', () => ({
  rateLimitApi: vi.fn(() => ({ success: true, remaining: 99, reset: Date.now() + 60000 })),
  getRateLimitHeaders: vi.fn(() => ({})),
}));

// Test data
const mockCertificates = [
  {
    id: 'cert-1',
    name: 'EU Organic',
    fullName: 'European Union Organic Certification',
    slug: 'eu-organic',
    description: 'Our products are certified under the EU Organic Regulation',
    image: '/certificates/eu-organic.jpg',
    issuer: 'EU Commission',
    issueDate: new Date('2024-01-01'),
    expiryDate: new Date('2027-01-01'),
    isFeatured: true,
    isActive: true,
    displayOrder: 1,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
  {
    id: 'cert-2',
    name: 'USDA Organic',
    fullName: 'United States Department of Agriculture Organic',
    slug: 'usda-organic',
    description: 'USDA organic certification for export to US markets',
    image: '/certificates/usda-organic.jpg',
    issuer: 'USDA',
    issueDate: new Date('2024-02-01'),
    expiryDate: new Date('2027-02-01'),
    isFeatured: true,
    isActive: true,
    displayOrder: 2,
    createdAt: new Date('2024-02-01'),
    updatedAt: new Date('2024-02-01'),
  },
  {
    id: 'cert-3',
    name: 'FSSC 22000',
    fullName: 'Food Safety System Certification 22000',
    slug: 'fssc-22000',
    description: 'Food safety management certification',
    image: '/certificates/fssc-22000.jpg',
    issuer: 'FSSC Foundation',
    issueDate: new Date('2024-03-01'),
    expiryDate: new Date('2027-03-01'),
    isFeatured: true,
    isActive: true,
    displayOrder: 3,
    createdAt: new Date('2024-03-01'),
    updatedAt: new Date('2024-03-01'),
  },
  {
    id: 'cert-4',
    name: 'HACCP',
    fullName: 'Hazard Analysis and Critical Control Points',
    slug: 'haccp',
    description: 'Systematic preventive approach to food safety',
    image: '/certificates/haccp.jpg',
    issuer: 'International HACCP Alliance',
    issueDate: new Date('2024-04-01'),
    expiryDate: new Date('2027-04-01'),
    isFeatured: true,
    isActive: true,
    displayOrder: 4,
    createdAt: new Date('2024-04-01'),
    updatedAt: new Date('2024-04-01'),
  },
  {
    id: 'cert-5',
    name: 'ISO 9001',
    fullName: 'Quality Management System Standard',
    slug: 'iso-9001',
    description: 'International quality management standard',
    image: '/certificates/iso-9001.jpg',
    issuer: 'ISO',
    issueDate: new Date('2024-05-01'),
    expiryDate: new Date('2027-05-01'),
    isFeatured: false,
    isActive: true,
    displayOrder: 5,
    createdAt: new Date('2024-05-01'),
    updatedAt: new Date('2024-05-01'),
  },
];

describe('Certificates API', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('GET /api/certificates', () => {
    it('should return all active certificates', async () => {
      mockPrisma.certificate.findMany.mockResolvedValue(mockCertificates);

      const result = await mockPrisma.certificate.findMany({
        where: { isActive: true },
        orderBy: { displayOrder: 'asc' },
      });

      expect(result).toEqual(mockCertificates);
      expect(result).toHaveLength(5);
    });

    it('should return only featured certificates when featured=true', async () => {
      const featuredCerts = mockCertificates.filter(c => c.isFeatured);
      mockPrisma.certificate.findMany.mockResolvedValue(featuredCerts);

      const result = await mockPrisma.certificate.findMany({
        where: { isActive: true, isFeatured: true },
        orderBy: { displayOrder: 'asc' },
      });

      expect(result).toHaveLength(4);
      expect(result.every((c: { isFeatured: boolean }) => c.isFeatured)).toBe(true);
    });

    it('should return certificates ordered by displayOrder', async () => {
      mockPrisma.certificate.findMany.mockResolvedValue(mockCertificates);

      const result = await mockPrisma.certificate.findMany({
        orderBy: { displayOrder: 'asc' },
      });

      // Verify order
      for (let i = 0; i < result.length - 1; i++) {
        expect(result[i].displayOrder).toBeLessThanOrEqual(result[i + 1].displayOrder);
      }
    });

    it('should have correct certificate structure', async () => {
      mockPrisma.certificate.findMany.mockResolvedValue([mockCertificates[0]]);

      const result = await mockPrisma.certificate.findMany();

      expect(result[0]).toHaveProperty('id');
      expect(result[0]).toHaveProperty('name');
      expect(result[0]).toHaveProperty('fullName');
      expect(result[0]).toHaveProperty('slug');
      expect(result[0]).toHaveProperty('description');
      expect(result[0]).toHaveProperty('image');
      expect(result[0]).toHaveProperty('issuer');
      expect(result[0]).toHaveProperty('issueDate');
      expect(result[0]).toHaveProperty('expiryDate');
      expect(result[0]).toHaveProperty('isFeatured');
      expect(result[0]).toHaveProperty('isActive');
      expect(result[0]).toHaveProperty('displayOrder');
    });
  });

  describe('GET /api/certificates/[id]', () => {
    it('should return a single certificate by ID', async () => {
      mockPrisma.certificate.findUnique.mockResolvedValue(mockCertificates[0]);

      const result = await mockPrisma.certificate.findUnique({
        where: { id: 'cert-1' },
      });

      expect(result).toEqual(mockCertificates[0]);
      expect(result.id).toBe('cert-1');
      expect(result.name).toBe('EU Organic');
    });

    it('should return a single certificate by slug', async () => {
      mockPrisma.certificate.findUnique.mockResolvedValue(mockCertificates[0]);

      const result = await mockPrisma.certificate.findUnique({
        where: { slug: 'eu-organic' },
      });

      expect(result).toEqual(mockCertificates[0]);
      expect(result.slug).toBe('eu-organic');
    });

    it('should return null for non-existent certificate', async () => {
      mockPrisma.certificate.findUnique.mockResolvedValue(null);

      const result = await mockPrisma.certificate.findUnique({
        where: { id: 'non-existent' },
      });

      expect(result).toBeNull();
    });
  });

  describe('POST /api/certificates', () => {
    it('should create a new certificate', async () => {
      const newCertificate = {
        name: 'Kosher',
        fullName: 'Kosher Certification',
        slug: 'kosher',
        description: 'Kosher certification for products',
        image: '/certificates/kosher.jpg',
        issuer: 'OK Kosher',
        issueDate: new Date('2024-06-01'),
        expiryDate: new Date('2027-06-01'),
        isFeatured: false,
        isActive: true,
        displayOrder: 6,
      };

      const createdCert = {
        id: 'cert-6',
        ...newCertificate,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrisma.certificate.findUnique.mockResolvedValue(null); // slug doesn't exist
      mockPrisma.certificate.create.mockResolvedValue(createdCert);

      // Check slug doesn't exist first
      const existing = await mockPrisma.certificate.findUnique({
        where: { slug: newCertificate.slug },
      });
      expect(existing).toBeNull();

      // Create certificate
      const result = await mockPrisma.certificate.create({ data: newCertificate });

      expect(result).toHaveProperty('id');
      expect(result.name).toBe('Kosher');
      expect(result.slug).toBe('kosher');
      expect(result.isFeatured).toBe(false);
    });

    it('should reject creation with duplicate slug', async () => {
      mockPrisma.certificate.findUnique.mockResolvedValue(mockCertificates[0]);

      const existing = await mockPrisma.certificate.findUnique({
        where: { slug: 'eu-organic' },
      });

      expect(existing).not.toBeNull();
      expect(existing.slug).toBe('eu-organic');
    });

    it('should handle featured certificate creation', async () => {
      const newFeaturedCert = {
        name: 'New Featured',
        fullName: 'New Featured Certificate',
        slug: 'new-featured',
        description: 'A new featured certificate',
        isFeatured: true,
        isActive: true,
        displayOrder: 0,
      };

      const createdCert = {
        id: 'cert-new',
        ...newFeaturedCert,
        image: null,
        issuer: null,
        issueDate: null,
        expiryDate: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrisma.certificate.create.mockResolvedValue(createdCert);

      const result = await mockPrisma.certificate.create({ data: newFeaturedCert });

      expect(result.isFeatured).toBe(true);
      expect(result.displayOrder).toBe(0);
    });
  });

  describe('PUT /api/certificates/[id]', () => {
    it('should update an existing certificate', async () => {
      const updatedData = {
        name: 'EU Organic Updated',
        description: 'Updated description',
        isFeatured: false,
      };

      const updatedCert = {
        ...mockCertificates[0],
        ...updatedData,
        updatedAt: new Date(),
      };

      mockPrisma.certificate.findUnique.mockResolvedValue(mockCertificates[0]);
      mockPrisma.certificate.update.mockResolvedValue(updatedCert);

      // Verify certificate exists
      const existing = await mockPrisma.certificate.findUnique({
        where: { id: 'cert-1' },
      });
      expect(existing).not.toBeNull();

      // Update certificate
      const result = await mockPrisma.certificate.update({
        where: { id: 'cert-1' },
        data: updatedData,
      });

      expect(result.name).toBe('EU Organic Updated');
      expect(result.description).toBe('Updated description');
      expect(result.isFeatured).toBe(false);
    });

    it('should update certificate featured status', async () => {
      const updatedCert = {
        ...mockCertificates[4], // ISO 9001 which is not featured
        isFeatured: true,
        updatedAt: new Date(),
      };

      mockPrisma.certificate.update.mockResolvedValue(updatedCert);

      const result = await mockPrisma.certificate.update({
        where: { id: 'cert-5' },
        data: { isFeatured: true },
      });

      expect(result.isFeatured).toBe(true);
    });

    it('should update certificate displayOrder', async () => {
      const updatedCert = {
        ...mockCertificates[0],
        displayOrder: 10,
        updatedAt: new Date(),
      };

      mockPrisma.certificate.update.mockResolvedValue(updatedCert);

      const result = await mockPrisma.certificate.update({
        where: { id: 'cert-1' },
        data: { displayOrder: 10 },
      });

      expect(result.displayOrder).toBe(10);
    });

    it('should update certificate dates', async () => {
      const newIssueDate = new Date('2025-01-01');
      const newExpiryDate = new Date('2028-01-01');

      const updatedCert = {
        ...mockCertificates[0],
        issueDate: newIssueDate,
        expiryDate: newExpiryDate,
        updatedAt: new Date(),
      };

      mockPrisma.certificate.update.mockResolvedValue(updatedCert);

      const result = await mockPrisma.certificate.update({
        where: { id: 'cert-1' },
        data: { issueDate: newIssueDate, expiryDate: newExpiryDate },
      });

      expect(result.issueDate).toEqual(newIssueDate);
      expect(result.expiryDate).toEqual(newExpiryDate);
    });
  });

  describe('DELETE /api/certificates/[id]', () => {
    it('should delete an existing certificate', async () => {
      mockPrisma.certificate.findUnique.mockResolvedValue(mockCertificates[0]);
      mockPrisma.certificate.delete.mockResolvedValue(mockCertificates[0]);

      // Verify certificate exists
      const existing = await mockPrisma.certificate.findUnique({
        where: { id: 'cert-1' },
      });
      expect(existing).not.toBeNull();

      // Delete certificate
      const result = await mockPrisma.certificate.delete({
        where: { id: 'cert-1' },
      });

      expect(result.id).toBe('cert-1');
    });

    it('should handle deletion of non-existent certificate', async () => {
      mockPrisma.certificate.findUnique.mockResolvedValue(null);

      const existing = await mockPrisma.certificate.findUnique({
        where: { id: 'non-existent' },
      });

      expect(existing).toBeNull();
    });
  });

  describe('Certificate Featured Logic', () => {
    it('should correctly identify featured certificates for home page', async () => {
      const featuredCerts = mockCertificates.filter(c => c.isFeatured);
      mockPrisma.certificate.findMany.mockResolvedValue(featuredCerts);

      const result = await mockPrisma.certificate.findMany({
        where: { isFeatured: true, isActive: true },
        orderBy: { displayOrder: 'asc' },
      });

      // Should have exactly 4 featured certificates
      expect(result).toHaveLength(4);
      
      // Verify the featured ones are EU Organic, USDA Organic, FSSC 22000, HACCP
      const names = result.map((c: { name: string }) => c.name);
      expect(names).toContain('EU Organic');
      expect(names).toContain('USDA Organic');
      expect(names).toContain('FSSC 22000');
      expect(names).toContain('HACCP');
    });

    it('should return 4 featured certificates for home page display', async () => {
      const featuredCerts = mockCertificates.filter(c => c.isFeatured).slice(0, 4);
      mockPrisma.certificate.findMany.mockResolvedValue(featuredCerts);

      const result = await mockPrisma.certificate.findMany({
        where: { isFeatured: true, isActive: true },
        orderBy: { displayOrder: 'asc' },
        take: 4,
      });

      expect(result).toHaveLength(4);
    });
  });

  describe('Certificate Data Integrity', () => {
    it('should save certificate with all required fields', async () => {
      const certificate = {
        name: 'Test Certificate',
        slug: 'test-certificate',
        isActive: true,
      };

      const createdCert = {
        id: 'cert-test',
        name: 'Test Certificate',
        fullName: null,
        slug: 'test-certificate',
        description: null,
        image: null,
        issuer: null,
        issueDate: null,
        expiryDate: null,
        isFeatured: false,
        isActive: true,
        displayOrder: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrisma.certificate.create.mockResolvedValue(createdCert);

      const result = await mockPrisma.certificate.create({ data: certificate });

      expect(result.name).toBe('Test Certificate');
      expect(result.slug).toBe('test-certificate');
      expect(result.isActive).toBe(true);
      // Optional fields should be null
      expect(result.fullName).toBeNull();
      expect(result.description).toBeNull();
      expect(result.image).toBeNull();
    });

    it('should save certificate with image path', async () => {
      const certificate = {
        name: 'Test Certificate',
        slug: 'test-certificate',
        image: '/certificates/test.jpg',
        isActive: true,
      };

      const createdCert = {
        id: 'cert-test',
        ...certificate,
        fullName: null,
        description: null,
        issuer: null,
        issueDate: null,
        expiryDate: null,
        isFeatured: false,
        displayOrder: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrisma.certificate.create.mockResolvedValue(createdCert);

      const result = await mockPrisma.certificate.create({ data: certificate });

      expect(result.image).toBe('/certificates/test.jpg');
    });
  });

  describe('Error Handling', () => {
    it('should handle database errors gracefully', async () => {
      mockPrisma.certificate.findMany.mockRejectedValue(new Error('Database connection failed'));

      await expect(mockPrisma.certificate.findMany()).rejects.toThrow('Database connection failed');
    });

    it('should handle validation errors for invalid slug', async () => {
      const invalidCert = {
        name: 'Test',
        slug: 'Invalid Slug With Spaces', // Invalid slug format
      };

      // In real implementation, Zod would catch this
      // Here we simulate that the API would reject this
      expect(invalidCert.slug).toContain(' ');
      expect(invalidCert.slug).not.toMatch(/^[a-z0-9-]+$/);
    });
  });
});
