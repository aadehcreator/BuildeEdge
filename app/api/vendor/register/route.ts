import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const VendorRegisterSchema = z.object({
  businessName: z.string().min(3, 'Business name required'),
  businessType: z.enum(['Manufacturer', 'Distributor', 'Retailer', 'Wholesaler']),
  gstin: z.string().optional(),
  pan: z.string().optional(),
  address: z.string().min(5),
  city: z.string().min(2),
  pincode: z.string().regex(/^\d{6}$/),
  phone: z.string().regex(/^[6-9]\d{9}$/),
  email: z.string().email(),
  bankName: z.string().optional(),
  accountNumber: z.string().optional(),
  ifsc: z.string().optional(),
  description: z.string().optional(),
});

export async function POST(req: NextRequest) {
  try {
    const user = requireAuth(req);
    const body = await req.json() as unknown;
    const parsed = VendorRegisterSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.errors[0].message }, { status: 400 });
    }

    // Check already registered
    const existing = await prisma.vendorProfile.findUnique({ where: { userId: user.userId } });
    if (existing) {
      return NextResponse.json({ error: 'Vendor profile already exists', status: existing.status }, { status: 400 });
    }

    const vendor = await prisma.$transaction(async (tx) => {
      const profile = await tx.vendorProfile.create({
        data: { ...parsed.data, userId: user.userId, status: 'PENDING', isActive: false },
      });

      // Update user role to VENDOR
      await tx.user.update({ where: { id: user.userId }, data: { role: 'VENDOR' } });

      return profile;
    });

    return NextResponse.json({
      success: true,
      message: 'Vendor registration submitted! Admin will review in 24-48 hours.',
      vendor,
    }, { status: 201 });
  } catch (error) {
    if (error instanceof Error && error.message === 'UNAUTHORIZED') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    console.error('vendor register error:', error);
    return NextResponse.json({ error: 'Registration failed' }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const user = requireAuth(req);
    const vendor = await prisma.vendorProfile.findUnique({
      where: { userId: user.userId },
      include: { _count: { select: { products: true, vendorOrders: true } } },
    });
    if (!vendor) return NextResponse.json({ vendor: null });
    return NextResponse.json({ vendor });
  } catch (error) {
    if (error instanceof Error && error.message === 'UNAUTHORIZED') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    return NextResponse.json({ error: 'Failed to fetch vendor profile' }, { status: 500 });
  }
}
