import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyAdminToken } from '@/lib/admin-auth';
import { exportRequestUpdateSchema } from '@/lib/validations';
import { rateLimitApi, getRateLimitHeaders } from '@/lib/rate-limit';

interface RouteParams {
  params: Promise<{ id: string }>;
}

// GET /api/export-requests/[id] - Get a single export request
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const admin = await verifyAdminToken(request);
    if (!admin) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { id } = await params;

    const exportRequest = await prisma.exportRequest.findUnique({
      where: { id },
    });

    if (!exportRequest) {
      return NextResponse.json(
        { success: false, error: 'Export request not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: exportRequest });
  } catch (error) {
    console.error('Error fetching export request:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch export request' },
      { status: 500 }
    );
  }
}

// PUT /api/export-requests/[id] - Update an export request
export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const admin = await verifyAdminToken(request);
    if (!admin) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const rateLimitResult = await rateLimitApi(request, 'export-requests-update');
    if (!rateLimitResult.success) {
      return NextResponse.json(
        { success: false, error: 'Too many requests' },
        { status: 429, headers: getRateLimitHeaders(rateLimitResult.remaining, rateLimitResult.reset) }
      );
    }

    const { id } = await params;
    const body = await request.json();
    const validatedData = exportRequestUpdateSchema.parse(body);

    const existingRequest = await prisma.exportRequest.findUnique({
      where: { id },
    });

    if (!existingRequest) {
      return NextResponse.json(
        { success: false, error: 'Export request not found' },
        { status: 404 }
      );
    }

    // Set respondedAt if status is changed to CONTACTED or beyond
    const updateData: Record<string, unknown> = { ...validatedData };
    if (
      validatedData.status &&
      ['CONTACTED', 'QUOTED', 'COMPLETED'].includes(validatedData.status) &&
      !existingRequest.respondedAt
    ) {
      updateData.respondedAt = new Date();
    }

    const exportRequest = await prisma.exportRequest.update({
      where: { id },
      data: updateData,
    });

    // Log audit
    await prisma.auditLog.create({
      data: {
        userId: admin.id,
        action: 'UPDATE',
        entity: 'ExportRequest',
        entityId: exportRequest.id,
        oldData: JSON.parse(JSON.stringify(existingRequest)),
        newData: JSON.parse(JSON.stringify(exportRequest)),
        ipAddress: request.headers.get('x-forwarded-for') || 'unknown',
      },
    });

    return NextResponse.json({ success: true, data: exportRequest });
  } catch (error) {
    console.error('Error updating export request:', error);
    if (error instanceof Error && error.name === 'ZodError') {
      return NextResponse.json(
        { success: false, error: 'Validation error', details: error },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { success: false, error: 'Failed to update export request' },
      { status: 500 }
    );
  }
}

// DELETE /api/export-requests/[id] - Delete an export request
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const admin = await verifyAdminToken(request);
    if (!admin) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const rateLimitResult = await rateLimitApi(request, 'export-requests-delete');
    if (!rateLimitResult.success) {
      return NextResponse.json(
        { success: false, error: 'Too many requests' },
        { status: 429, headers: getRateLimitHeaders(rateLimitResult.remaining, rateLimitResult.reset) }
      );
    }

    const { id } = await params;

    const exportRequest = await prisma.exportRequest.findUnique({
      where: { id },
    });

    if (!exportRequest) {
      return NextResponse.json(
        { success: false, error: 'Export request not found' },
        { status: 404 }
      );
    }

    await prisma.exportRequest.delete({
      where: { id },
    });

    // Log audit
    await prisma.auditLog.create({
      data: {
        userId: admin.id,
        action: 'DELETE',
        entity: 'ExportRequest',
        entityId: id,
        oldData: JSON.parse(JSON.stringify(exportRequest)),
        ipAddress: request.headers.get('x-forwarded-for') || 'unknown',
      },
    });

    return NextResponse.json({ success: true, message: 'Export request deleted' });
  } catch (error) {
    console.error('Error deleting export request:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete export request' },
      { status: 500 }
    );
  }
}
