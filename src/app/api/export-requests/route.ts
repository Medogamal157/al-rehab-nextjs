import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyAdminToken } from '@/lib/admin-auth';
import { exportRequestCreateSchema, exportRequestUpdateSchema } from '@/lib/validations';
import { rateLimitApi, getRateLimitHeaders } from '@/lib/rate-limit';

// GET /api/export-requests - Get all export requests (admin only)
export async function GET(request: NextRequest) {
  try {
    const admin = await verifyAdminToken(request);
    if (!admin) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const skip = (page - 1) * limit;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const where: any = {};
    if (status) where.status = status;

    const [exportRequests, total] = await Promise.all([
      prisma.exportRequest.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.exportRequest.count({ where }),
    ]);

    return NextResponse.json({
      success: true,
      data: exportRequests,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching export requests:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch export requests' },
      { status: 500 }
    );
  }
}

// POST /api/export-requests - Create a new export request (public)
export async function POST(request: NextRequest) {
  try {
    const rateLimitResult = await rateLimitApi(request, 'export-requests-create');
    if (!rateLimitResult.success) {
      return NextResponse.json(
        { success: false, error: 'Too many requests. Please try again later.' },
        { status: 429, headers: getRateLimitHeaders(rateLimitResult.remaining, rateLimitResult.reset) }
      );
    }

    const body = await request.json();
    const validatedData = exportRequestCreateSchema.parse(body);

    const exportRequest = await prisma.exportRequest.create({
      data: validatedData,
    });

    return NextResponse.json(
      { success: true, data: { id: exportRequest.id }, message: 'Your request has been submitted successfully' },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating export request:', error);
    if (error instanceof Error && error.name === 'ZodError') {
      return NextResponse.json(
        { success: false, error: 'Validation error', details: error },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { success: false, error: 'Failed to submit request' },
      { status: 500 }
    );
  }
}

// PUT /api/export-requests - Bulk update (admin only)
export async function PUT(request: NextRequest) {
  try {
    const admin = await verifyAdminToken(request);
    if (!admin) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const rateLimitResult = await rateLimitApi(request, 'export-requests-bulk-update');
    if (!rateLimitResult.success) {
      return NextResponse.json(
        { success: false, error: 'Too many requests' },
        { status: 429, headers: getRateLimitHeaders(rateLimitResult.remaining, rateLimitResult.reset) }
      );
    }

    const body = await request.json();
    const { ids, ...updateData } = body;

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json(
        { success: false, error: 'IDs are required' },
        { status: 400 }
      );
    }

    const validatedData = exportRequestUpdateSchema.parse(updateData);

    await prisma.exportRequest.updateMany({
      where: { id: { in: ids } },
      data: validatedData,
    });

    return NextResponse.json({ success: true, message: `${ids.length} requests updated` });
  } catch (error) {
    console.error('Error bulk updating export requests:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update requests' },
      { status: 500 }
    );
  }
}
