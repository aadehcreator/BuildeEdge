import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { uploadToCloudinary } from '@/lib/cloudinary';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  try {
    const user = requireAuth(req);
    if (!['ADMIN', 'VENDOR'].includes(user.role)) {
      return NextResponse.json({ error: 'Only admins and vendors can upload product images' }, { status: 403 });
    }

    const formData = await req.formData();
    const file = formData.get('file');
    if (!(file instanceof File)) {
      return NextResponse.json({ error: 'Image file is required' }, { status: 400 });
    }
    if (!file.type.startsWith('image/')) {
      return NextResponse.json({ error: 'Only image files are allowed' }, { status: 400 });
    }
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: 'Image must be smaller than 5MB' }, { status: 400 });
    }

    const imageUrl = await uploadToCloudinary(Buffer.from(await file.arrayBuffer()), 'buildedge/products');
    return NextResponse.json({ url: imageUrl });
  } catch (error) {
    if (error instanceof Error && error.message === 'UNAUTHORIZED') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    console.error('product image upload error:', error);
    return NextResponse.json({ error: 'Image upload failed. Check Cloudinary configuration.' }, { status: 500 });
  }
}
