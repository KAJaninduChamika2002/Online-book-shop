import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import ProductCard from '../common/ProductCard';
import { ProductCardSkeleton } from '../common/Skeleton';

export default function ProductSection({ title, subtitle, products, loading, viewAllLink, badge }) {
  return (
    <section className="py-12">
      <div className="container-custom">
        <div className="flex items-end justify-between mb-8">
          <div>
            {badge && (
              <span className="inline-block bg-orange-100 text-orange-600 text-xs font-bold px-3 py-1 rounded-full mb-2 uppercase tracking-wider">
                {badge}
              </span>
            )}
            <h2 className="section-title">{title}</h2>
            {subtitle && <p className="text-gray-500 mt-1 text-sm">{subtitle}</p>}
          </div>
          {viewAllLink && (
            <Link to={viewAllLink} className="flex items-center gap-1.5 text-blue-600 hover:text-blue-700 font-semibold text-sm group">
              View All <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          )}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
          {loading
            ? Array.from({ length: 6 }).map((_, i) => <ProductCardSkeleton key={i} />)
            : products?.map(p => <ProductCard key={p.id} product={p} />)
          }
        </div>

        {!loading && (!products || products.length === 0) && (
          <div className="text-center py-10 text-gray-400">No products found</div>
        )}
      </div>
    </section>
  );
}
