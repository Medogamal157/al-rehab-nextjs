import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyAdminToken } from '@/lib/admin-auth';
import { categoryUpdateSchema } from '@/lib/validations';
import { rateLimitApi, getRateLimitHeaders } from '@/lib/rate-limit';

interface RouteParams {
  params: Promise<{ id: string }>;
}

// GET /api/categories/[id] - Get a single category
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const { searchParams } = new URL(request.url);
    const includeProducts = searchParams.get('includeProducts') === 'true';

    const category = await prisma.category.findUnique({
      where: { id },
      include: includeProducts ? {
        products: {
          include: {
            images: {
              orderBy: { order: 'asc' },
            },
          },
          orderBy: { displayOrder: 'asc' },
        },
      } : undefined,
    });

    if (!category) {
      return NextResponse.json(
        { success: false, error: 'Category not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: category });
  } catch (error) {
    console.error('Error fetching category:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch category' },
      { status: 500 }
    );
  }
}

// PUT /api/categories/[id] - Update a category
export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const admin = await verifyAdminToken(request);
    if (!admin) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const rateLimitResult = await rateLimitApi(request, 'categories-update');
    if (!rateLimitResult.success) {
      return NextResponse.json(
        { success: false, error: 'Too many requests' },
        { status: 429, headers: getRateLimitHeaders(rateLimitResult.remaining, rateLimitResult.reset) }
      );
    }

    const { id } = await params;
    const body = await request.json();
    const validatedData = categoryUpdateSchema.parse(body);

    // Check if category exists
    const existingCategory = await prisma.category.findUnique({
      where: { id },
    });

    if (!existingCategory) {
      return NextResponse.json(
        { success: false, error: 'Category not found' },
        { status: 404 }
      );
    }

    // Check if slug is being changed and if new slug already exists
    if (validatedData.slug && validatedData.slug !== existingCategory.slug) {
      const slugExists = await prisma.category.findUnique({
        where: { slug: validatedData.slug },
      });
      if (slugExists) {
        return NextResponse.json(
          { success: false, error: 'Category with this slug already exists' },
          { status: 400 }
        );
      }
    }

    const category = await prisma.category.update({
      where: { id },
      data: validatedData,
    });

    // Log audit
    await prisma.auditLog.create({
      data: {
        userId: admin.id,
        action: 'UPDATE',
        entity: 'Category',
        entityId: category.id,
        oldData: JSON.parse(JSON.stringify(existingCategory)),
        newData: JSON.parse(JSON.stringify(category)),
        ipAddress: request.headers.get('x-forwarded-for') || 'unknown',
      },
    });

    return NextResponse.json({ success: true, data: category });
  } catch (error) {
    console.error('Error updating category:', error);
    if (error instanceof Error && error.name === 'ZodError') {
      return NextResponse.json(
        { success: false, error: 'Validation error', details: error },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { success: false, error: 'Failed to update category' },
      { status: 500 }
    );
  }
}

// DELETE /api/categories/[id] - Delete a category
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const admin = await verifyAdminToken(request);
    if (!admin) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const rateLimitResult = await rateLimitApi(request, 'categories-delete');
    if (!rateLimitResult.success) {
      return NextResponse.json(
        { success: false, error: 'Too many requests' },
        { status: 429, headers: getRateLimitHeaders(rateLimitResult.remaining, rateLimitResult.reset) }
      );
    }

    const { id } = await params;

    // Check if category exists and has products
    const category = await prisma.category.findUnique({
      where: { id },
      include: { _count: { select: { products: true } } },
    });

    if (!category) {
      return NextResponse.json(
        { success: false, error: 'Category not found' },
        { status: 404 }
      );
    }

    if (category._count.products > 0) {
      return NextResponse.json(
        { success: false, error: 'Cannot delete category with existing products' },
        { status: 400 }
      );
    }

    await prisma.category.delete({
      where: { id },
    });

    // Log audit
    await prisma.auditLog.create({
      data: {
        userId: admin.id,
        action: 'DELETE',
        entity: 'Category',
        entityId: id,
        oldData: JSON.parse(JSON.stringify(category)),
        ipAddress: request.headers.get('x-forwarded-for') || 'unknown',
      },
    });

    return NextResponse.json({ success: true, message: 'Category deleted' });
  } catch (error) {
    console.error('Error deleting category:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete category' },
      { status: 500 }
    );
  }
}
