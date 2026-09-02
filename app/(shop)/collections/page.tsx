import { prisma } from '@/lib/prisma';
import Image from 'next/image';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function CollectionsPage() {
  const categories = await prisma.category.findMany({
    where: { isActive: true, parentId: null },
    include: {
      children: { where: { isActive: true }, orderBy: { sortOrder: 'asc' } },
      _count: { select: { products: true } },
    },
    orderBy: { sortOrder: 'asc' },
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
      <h1 className="font-heading font-bold text-2xl text-secondary mb-6">All Categories</h1>

      <div className="space-y-8">
        {categories.map((cat) => (
          <section key={cat.id}>
            <div className="flex items-center justify-between mb-3">
              <Link href={`/collections/${cat.slug}`} className="flex items-center gap-3 group">
                <div className="w-10 h-10 rounded-xl overflow-hidden bg-orange-50">
                  <Image src={cat.image} alt={cat.name} width={40} height={40} className="w-full h-full object-cover" />
                </div>
                <div>
                  <h2 className="font-heading font-bold text-lg text-secondary group-hover:text-primary transition-colors">{cat.name}</h2>
                  <p className="text-xs text-muted">{cat._count.products} products</p>
                </div>
              </Link>
              <Link href={`/collections/${cat.slug}`} className="text-sm text-primary font-semibold hover:underline">
                View all →
              </Link>
            </div>

            {cat.children.length > 0 && (
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
                {cat.children.map((sub) => (
                  <Link
                    key={sub.id}
                    href={`/collections/${sub.slug}`}
                    className="flex flex-col items-center gap-1.5 p-2.5 bg-white rounded-xl border border-gray-100 hover:border-primary hover:shadow-sm transition-all group"
                  >
                    <div className="w-10 h-10 rounded-lg overflow-hidden bg-gray-50">
                      <Image src={sub.image} alt={sub.name} width={40} height={40} className="w-full h-full object-cover group-hover:scale-110 transition-transform" />
                    </div>
                    <span className="text-xs font-medium text-center text-secondary group-hover:text-primary leading-tight line-clamp-2">
                      {sub.name}
                    </span>
                  </Link>
                ))}
              </div>
            )}
          </section>
        ))}
      </div>
    </div>
  );
}
