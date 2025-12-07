import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyAdminToken } from '@/lib/admin-auth';
import { categoryCreateSchema } from '@/lib/validations';
import { rateLimitApi, getRateLimitHeaders } from '@/lib/rate-limit';

// GET /api/categories - Get all categories
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const includeProducts = searchParams.get('includeProducts') === 'true';
    const activeOnly = searchParams.get('activeOnly') !== 'false';

    const categories = await prisma.category.findMany({
      where: activeOnly ? { isActive: true } : {},
      include: includeProducts ? {
        products: {
          where: { isActive: true },
          include: {
            images: {
              orderBy: { order: 'asc' },
            },
          },
          orderBy: { displayOrder: 'asc' },
        },
      } : undefined,
      orderBy: { displayOrder: 'asc' },
    });

    return NextResponse.json({ success: true, data: categories });
  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch categories' },
      { status: 500 }
    );
  }
}

// POST /api/categories - Create a new category
export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const admin = await verifyAdminToken(request);
    if (!admin) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Rate limiting
    const rateLimitResult = await rateLimitApi(request, 'categories-create');
    if (!rateLimitResult.success) {
      return NextResponse.json(
        { success: false, error: 'Too many requests' },
        { status: 429, headers: getRateLimitHeaders(rateLimitResult.remaining, rateLimitResult.reset) }
      );
    }

    const body = await request.json();
    const validatedData = categoryCreateSchema.parse(body);

    // Check if slug already exists
    const existingCategory = await prisma.category.findUnique({
      where: { slug: validatedData.slug },
    });

    if (existingCategory) {
      return NextResponse.json(
        { success: false, error: 'Category with this slug already exists' },
        { status: 400 }
      );
    }

    const category = await prisma.category.create({
      data: validatedData,
    });

    // Log audit
    await prisma.auditLog.create({
      data: {
        userId: admin.id,
        action: 'CREATE',
        entity: 'Category',
        entityId: category.id,
        newData: JSON.parse(JSON.stringify(category)),
        ipAddress: request.headers.get('x-forwarded-for') || 'unknown',
      },
    });

    return NextResponse.json(
      { success: true, data: category },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating category:', error);
    if (error instanceof Error && error.name === 'ZodError') {
      return NextResponse.json(
        { success: false, error: 'Validation error', details: error },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { success: false, error: 'Failed to create category' },
      { status: 500 }
    );
  }
}
