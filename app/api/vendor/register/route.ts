import { NextRequest, NextResponse } from 'next/server';
import { getUserFromRequest, signAccessToken, signRefreshToken } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const VendorRegisterSchema = z.object({
  businessName: z.string().min(2, 'Business name required'),
  businessType: z.enum(['Manufacturer', 'Distributor', 'Retailer', 'Wholesaler']).optional().default('Retailer'),
  gstin: z.string().optional(),
  pan: z.string().optional(),
  address: z.string().min(3, 'Address is required'),
  city: z.string().min(2, 'City is required'),
  pincode: z.string().regex(/^\d{6}$/, 'Enter valid 6 digit pincode').optional().default('474001'),
  phone: z.string().regex(/^[6-9]\d{9}$/, 'Enter valid 10 digit Indian phone number'),
  email: z.string().email().optional().default('vendor@buildedge.in'),
  bankName: z.string().optional(),
  accountNumber: z.string().optional(),
  ifsc: z.string().optional(),
  description: z.string().optional(),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json() as unknown;
    const parsed = VendorRegisterSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.errors[0].message }, { status: 400 });
    }

    // Check if user is already authenticated
    let userPayload = getUserFromRequest(req);
    let userId = userPayload?.userId;

    // If not authenticated or token expired, find or create user by phone
    if (!userId) {
      let dbUser = await prisma.user.findUnique({ where: { phone: parsed.data.phone } });
      if (!dbUser) {
        dbUser = await prisma.user.create({
          data: {
            phone: parsed.data.phone,
            name: parsed.data.businessName,
            email: parsed.data.email,
            role: 'VENDOR',
          },
        });
      } else {
        await prisma.user.update({
          where: { id: dbUser.id },
          data: { role: 'VENDOR' },
        });
      }
      userId = dbUser.id;
      userPayload = { userId: dbUser.id, phone: dbUser.phone, role: 'VENDOR' };
    }

    // Check if vendor profile already exists for this user or phone
    let vendor = await prisma.vendorProfile.findFirst({
      where: {
        OR: [
          { userId },
          { phone: parsed.data.phone },
        ],
      },
    });

    if (vendor) {
      // Update existing vendor
      vendor = await prisma.vendorProfile.update({
        where: { id: vendor.id },
        data: {
          ...parsed.data,
          userId,
          status: 'APPROVED',
          isActive: true,
        },
      });
    } else {
      // Create new approved vendor
      vendor = await prisma.vendorProfile.create({
        data: {
          ...parsed.data,
          userId,
          status: 'APPROVED',
          isActive: true,
        },
      });
    }

    // Ensure user role is VENDOR
    await prisma.user.update({
      where: { id: userId! },
      data: { role: 'VENDOR' },
    });

    // Generate fresh tokens for instant seamless login
    const accessToken = signAccessToken({ userId: userId!, phone: parsed.data.phone, role: 'VENDOR' });
    const refreshToken = signRefreshToken({ userId: userId!, phone: parsed.data.phone, role: 'VENDOR' });

    const response = NextResponse.json({
      success: true,
      message: '🎉 वेंडर रजिस्ट्रेशन सफल! आपकी दुकान सक्रिय हो गई है।',
      vendor,
      user: { id: userId!, phone: parsed.data.phone, name: parsed.data.businessName, role: 'VENDOR' },
      accessToken,
      refreshToken,
    }, { status: 201 });

    response.cookies.set('token', accessToken, { path: '/', maxAge: 604800, sameSite: 'lax' });
    return response;
  } catch (error) {
    console.error('vendor register error:', error);
    return NextResponse.json({ error: 'Registration failed. Please try again.' }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const user = getUserFromRequest(req);
    if (!user) {
      return NextResponse.json({ vendor: null });
    }
    const vendor = await prisma.vendorProfile.findUnique({
      where: { userId: user.userId },
      include: { _count: { select: { products: true, vendorOrders: true } } },
    });
    return NextResponse.json({ vendor: vendor ?? null });
  } catch (error) {
    console.error('vendor register GET error:', error);
    return NextResponse.json({ vendor: null });
  }
}
