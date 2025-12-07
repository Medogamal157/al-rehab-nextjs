import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyAdminToken } from '@/lib/admin-auth';
import { certificateUpdateSchema } from '@/lib/validations';
import { rateLimitApi, getRateLimitHeaders } from '@/lib/rate-limit';

interface RouteParams {
  params: Promise<{ id: string }>;
}

// GET /api/certificates/[id] - Get a single certificate
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;

    // Try to find by ID first, then by slug
    let certificate = await prisma.certificate.findUnique({
      where: { id },
    });

    if (!certificate) {
      certificate = await prisma.certificate.findUnique({
        where: { slug: id },
      });
    }

    if (!certificate) {
      return NextResponse.json(
        { success: false, error: 'Certificate not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: certificate });
  } catch (error) {
    console.error('Error fetching certificate:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch certificate' },
      { status: 500 }
    );
  }
}

// PUT /api/certificates/[id] - Update a certificate
export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const admin = await verifyAdminToken(request);
    if (!admin) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const rateLimitResult = await rateLimitApi(request, 'certificates-update');
    if (!rateLimitResult.success) {
      return NextResponse.json(
        { success: false, error: 'Too many requests' },
        { status: 429, headers: getRateLimitHeaders(rateLimitResult.remaining, rateLimitResult.reset) }
      );
    }

    const { id } = await params;
    const body = await request.json();
    const validatedData = certificateUpdateSchema.parse(body);

    const existingCert = await prisma.certificate.findUnique({
      where: { id },
    });

    if (!existingCert) {
      return NextResponse.json(
        { success: false, error: 'Certificate not found' },
        { status: 404 }
      );
    }

    // Check if slug is being changed and if new slug already exists
    if (validatedData.slug && validatedData.slug !== existingCert.slug) {
      const slugExists = await prisma.certificate.findUnique({
        where: { slug: validatedData.slug },
      });
      if (slugExists) {
        return NextResponse.json(
          { success: false, error: 'Certificate with this slug already exists' },
          { status: 400 }
        );
      }
    }

    // Convert date strings to Date objects if present and not empty
    const updateData = {
      ...validatedData,
      issueDate: validatedData.issueDate && validatedData.issueDate !== '' 
        ? new Date(validatedData.issueDate as string) 
        : null,
      expiryDate: validatedData.expiryDate && validatedData.expiryDate !== '' 
        ? new Date(validatedData.expiryDate as string) 
        : null,
    };

    const certificate = await prisma.certificate.update({
      where: { id },
      data: updateData,
    });

    // Log audit
    await prisma.auditLog.create({
      data: {
        userId: admin.id,
        action: 'UPDATE',
        entity: 'Certificate',
        entityId: certificate.id,
        oldData: JSON.parse(JSON.stringify(existingCert)),
        newData: JSON.parse(JSON.stringify(certificate)),
        ipAddress: request.headers.get('x-forwarded-for') || 'unknown',
      },
    });

    return NextResponse.json({ success: true, data: certificate });
  } catch (error) {
    console.error('Error updating certificate:', error);
    if (error instanceof Error && error.name === 'ZodError') {
      return NextResponse.json(
        { success: false, error: 'Validation error', details: error },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { success: false, error: 'Failed to update certificate' },
      { status: 500 }
    );
  }
}

// DELETE /api/certificates/[id] - Delete a certificate
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const admin = await verifyAdminToken(request);
    if (!admin) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const rateLimitResult = await rateLimitApi(request, 'certificates-delete');
    if (!rateLimitResult.success) {
      return NextResponse.json(
        { success: false, error: 'Too many requests' },
        { status: 429, headers: getRateLimitHeaders(rateLimitResult.remaining, rateLimitResult.reset) }
      );
    }

    const { id } = await params;

    const certificate = await prisma.certificate.findUnique({
      where: { id },
    });

    if (!certificate) {
      return NextResponse.json(
        { success: false, error: 'Certificate not found' },
        { status: 404 }
      );
    }

    await prisma.certificate.delete({
      where: { id },
    });

    // Log audit
    await prisma.auditLog.create({
      data: {
        userId: admin.id,
        action: 'DELETE',
        entity: 'Certificate',
        entityId: id,
        oldData: JSON.parse(JSON.stringify(certificate)),
        ipAddress: request.headers.get('x-forwarded-for') || 'unknown',
      },
    });

    return NextResponse.json({ success: true, message: 'Certificate deleted' });
  } catch (error) {
    console.error('Error deleting certificate:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete certificate' },
      { status: 500 }
    );
  }
}
