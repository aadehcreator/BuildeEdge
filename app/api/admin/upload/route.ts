import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth';
import { uploadToCloudinary } from '@/lib/cloudinary';

export async function POST(req: NextRequest) {
  try {
    requireAdmin(req);
    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    if (!file) return NextResponse.json({ error: 'No file provided' }, { status: 400 });

    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) return NextResponse.json({ error: 'File too large (max 5MB)' }, { status: 400 });

    const allowed = ['image/jpeg', 'image/png', 'image/webp'];
    if (!allowed.includes(file.type)) return NextResponse.json({ error: 'Only JPEG, PNG, WEBP allowed' }, { status: 400 });

    const buffer = Buffer.from(await file.arrayBuffer());
    const folder = (formData.get('folder') as string | null) ?? 'buildedge/products';
    const url = await uploadToCloudinary(buffer, folder);

    return NextResponse.json({ url });
  } catch (error) {
    if (error instanceof Error && ['UNAUTHORIZED', 'FORBIDDEN'].includes(error.message)) {
      return NextResponse.json({ error: error.message }, { status: error.message === 'UNAUTHORIZED' ? 401 : 403 });
    }
    console.error('upload error:', error);
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
  }
}
