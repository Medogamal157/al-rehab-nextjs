import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyAdminToken } from '@/lib/admin-auth';
import { productImageSchema } from '@/lib/validations';
import { rateLimitApi, getRateLimitHeaders } from '@/lib/rate-limit';

interface RouteParams {
  params: Promise<{ id: string }>;
}

// GET /api/products/[id]/images - Get all images for a product
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;

    const images = await prisma.productImage.findMany({
      where: { productId: id },
      orderBy: { order: 'asc' },
    });

    return NextResponse.json({ success: true, data: images });
  } catch (error) {
    console.error('Error fetching product images:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch images' },
      { status: 500 }
    );
  }
}

// POST /api/products/[id]/images - Add image to product
export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    const admin = await verifyAdminToken(request);
    if (!admin) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const rateLimitResult = await rateLimitApi(request, 'product-images-create');
    if (!rateLimitResult.success) {
      return NextResponse.json(
        { success: false, error: 'Too many requests' },
        { status: 429, headers: getRateLimitHeaders(rateLimitResult.remaining, rateLimitResult.reset) }
      );
    }

    const { id } = await params;
    const body = await request.json();
    
    // Override productId with route param
    const validatedData = productImageSchema.parse({ ...body, productId: id });

    // Check if product exists
    const product = await prisma.product.findUnique({
      where: { id },
    });

    if (!product) {
      return NextResponse.json(
        { success: false, error: 'Product not found' },
        { status: 404 }
      );
    }

    // If this is set as main image, unset other main images
    if (validatedData.isMain) {
      await prisma.productImage.updateMany({
        where: { productId: id, isMain: true },
        data: { isMain: false },
      });
    }

    const image = await prisma.productImage.create({
      data: validatedData,
    });

    return NextResponse.json(
      { success: true, data: image },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error adding product image:', error);
    if (error instanceof Error && error.name === 'ZodError') {
      return NextResponse.json(
        { success: false, error: 'Validation error', details: error },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { success: false, error: 'Failed to add image' },
      { status: 500 }
    );
  }
}

// DELETE /api/products/[id]/images - Delete an image
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const admin = await verifyAdminToken(request);
    if (!admin) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { id } = await params;
    const { searchParams } = new URL(request.url);
    const imageId = searchParams.get('imageId');

    if (!imageId) {
      return NextResponse.json(
        { success: false, error: 'Image ID is required' },
        { status: 400 }
      );
    }

    const image = await prisma.productImage.findFirst({
      where: { id: imageId, productId: id },
    });

    if (!image) {
      return NextResponse.json(
        { success: false, error: 'Image not found' },
        { status: 404 }
      );
    }

    await prisma.productImage.delete({
      where: { id: imageId },
    });

    return NextResponse.json({ success: true, message: 'Image deleted' });
  } catch (error) {
    console.error('Error deleting product image:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete image' },
      { status: 500 }
    );
  }
}
