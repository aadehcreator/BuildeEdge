import Image from 'next/image';
import Link from 'next/link';

interface Category {
  id: string;
  name: string;
  slug: string;
  image: string;
  children?: { id: string; name: string; slug: string }[];
}

export default function CategoryGrid({ categories }: { categories: Category[] }) {
  return (
    <section>
      <div className="flex items-center justify-between mb-4">
        <h2 className="section-title">Shop by Category</h2>
        <Link href="/collections" className="text-sm text-primary font-semibold hover:underline">
          All categories →
        </Link>
      </div>
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
        {categories.map((cat) => (
          <Link
            key={cat.id}
            href={`/collections/${cat.slug}`}
            className="group flex flex-col items-center gap-2 p-3 bg-white rounded-xl border border-gray-100 hover:border-primary hover:shadow-sm transition-all duration-200"
          >
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl overflow-hidden bg-orange-50 flex items-center justify-center">
              <Image
                src={cat.image}
                alt={cat.name}
                width={56}
                height={56}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
              />
            </div>
            <span className="text-xs font-semibold text-center text-secondary group-hover:text-primary transition-colors leading-tight line-clamp-2">
              {cat.name}
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
