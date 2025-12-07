import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyAdminToken } from '@/lib/admin-auth';
import { certificateCreateSchema, generateSlug } from '@/lib/validations';
import { rateLimitApi, getRateLimitHeaders } from '@/lib/rate-limit';

// GET /api/certificates - Get all certificates
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const featured = searchParams.get('featured') === 'true';
    const activeOnly = searchParams.get('activeOnly') !== 'false';

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const where: any = {};
    if (activeOnly) where.isActive = true;
    if (featured) where.isFeatured = true;

    const certificates = await prisma.certificate.findMany({
      where,
      orderBy: { displayOrder: 'asc' },
    });

    return NextResponse.json({ success: true, data: certificates });
  } catch (error) {
    console.error('Error fetching certificates:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch certificates' },
      { status: 500 }
    );
  }
}

// POST /api/certificates - Create a new certificate
export async function POST(request: NextRequest) {
  try {
    const admin = await verifyAdminToken(request);
    if (!admin) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const rateLimitResult = await rateLimitApi(request, 'certificates-create');
    if (!rateLimitResult.success) {
      return NextResponse.json(
        { success: false, error: 'Too many requests' },
        { status: 429, headers: getRateLimitHeaders(rateLimitResult.remaining, rateLimitResult.reset) }
      );
    }

    const body = await request.json();
    const validatedData = certificateCreateSchema.parse(body);

    // Auto-generate slug if not provided
    const slug = validatedData.slug || generateSlug(validatedData.name);

    // Check if slug already exists
    const existingCert = await prisma.certificate.findUnique({
      where: { slug },
    });

    if (existingCert) {
      return NextResponse.json(
        { success: false, error: 'Certificate with this slug already exists' },
        { status: 400 }
      );
    }

    // Convert date strings to Date objects if present and not empty
    const createData = {
      ...validatedData,
      slug,
      issueDate: validatedData.issueDate && validatedData.issueDate !== '' 
        ? new Date(validatedData.issueDate) 
        : null,
      expiryDate: validatedData.expiryDate && validatedData.expiryDate !== '' 
        ? new Date(validatedData.expiryDate) 
        : null,
    };

    const certificate = await prisma.certificate.create({
      data: createData,
    });

    // Log audit
    await prisma.auditLog.create({
      data: {
        userId: admin.id,
        action: 'CREATE',
        entity: 'Certificate',
        entityId: certificate.id,
        newData: JSON.parse(JSON.stringify(certificate)),
        ipAddress: request.headers.get('x-forwarded-for') || 'unknown',
      },
    });

    return NextResponse.json(
      { success: true, data: certificate },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating certificate:', error);
    if (error instanceof Error && error.name === 'ZodError') {
      return NextResponse.json(
        { success: false, error: 'Validation error', details: error },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { success: false, error: 'Failed to create certificate' },
      { status: 500 }
    );
  }
}
