import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { BannerSchema } from '@/lib/validators';

export async function GET(req: NextRequest) {
  try {
    requireAdmin(req);
    const banners = await prisma.banner.findMany({ orderBy: { sortOrder: 'asc' } });
    return NextResponse.json({ banners });
  } catch (error) {
    if (error instanceof Error && ['UNAUTHORIZED', 'FORBIDDEN'].includes(error.message)) {
      return NextResponse.json({ error: error.message }, { status: error.message === 'UNAUTHORIZED' ? 401 : 403 });
    }
    return NextResponse.json({ error: 'Failed to fetch banners' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    requireAdmin(req);
    const body = await req.json() as unknown;
    const parsed = BannerSchema.safeParse(body);
    if (!parsed.success) return NextResponse.json({ error: parsed.error.errors[0].message }, { status: 400 });

    const banner = await prisma.banner.create({ data: parsed.data });
    return NextResponse.json({ banner }, { status: 201 });
  } catch (error) {
    if (error instanceof Error && ['UNAUTHORIZED', 'FORBIDDEN'].includes(error.message)) {
      return NextResponse.json({ error: error.message }, { status: error.message === 'UNAUTHORIZED' ? 401 : 403 });
    }
    return NextResponse.json({ error: 'Failed to create banner' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    requireAdmin(req);
    const body = await req.json() as { id?: string } & Record<string, unknown>;
    const { id, ...data } = body;
    if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 });

    const banner = await prisma.banner.update({ where: { id }, data });
    return NextResponse.json({ banner });
  } catch (error) {
    if (error instanceof Error && ['UNAUTHORIZED', 'FORBIDDEN'].includes(error.message)) {
      return NextResponse.json({ error: error.message }, { status: error.message === 'UNAUTHORIZED' ? 401 : 403 });
    }
    return NextResponse.json({ error: 'Failed to update banner' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    requireAdmin(req);
    const id = new URL(req.url).searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 });
    await prisma.banner.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof Error && ['UNAUTHORIZED', 'FORBIDDEN'].includes(error.message)) {
      return NextResponse.json({ error: error.message }, { status: error.message === 'UNAUTHORIZED' ? 401 : 403 });
    }
    return NextResponse.json({ error: 'Failed to delete banner' }, { status: 500 });
  }
}
