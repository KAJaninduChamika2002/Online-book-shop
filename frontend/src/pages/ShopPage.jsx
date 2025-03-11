import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { SlidersHorizontal, X, ChevronDown, LayoutGrid, List } from 'lucide-react';
import ProductCard from '../components/common/ProductCard';
import { ProductCardSkeleton } from '../components/common/Skeleton';
import api from '../utils/api';

const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest First' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
  { value: 'popular', label: 'Most Popular' },
  { value: 'name', label: 'Name A-Z' },
];

const AGE_GROUPS = ['2+', '3+', '4+', '5+', '6+', '8+', '10+', 'All Ages'];

export default function ShopPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({});
  const [showFilters, setShowFilters] = useState(false);

  const category = searchParams.get('category') || '';
  const search = searchParams.get('search') || '';
  const sort = searchParams.get('sort') || 'newest';
  const page = parseInt(searchParams.get('page') || '1');
  const minPrice = searchParams.get('minPrice') || '';
  const maxPrice = searchParams.get('maxPrice') || '';
  const ageGroup = searchParams.get('ageGroup') || '';
  const featured = searchParams.get('featured') || '';
  const bestseller = searchParams.get('bestseller') || '';
  const newArrival = searchParams.get('newArrival') || '';

  const setParam = (key, value) => {
    const p = new URLSearchParams(searchParams);
    if (value) p.set(key, value); else p.delete(key);
    p.delete('page');
    setSearchParams(p);
  };

  useEffect(() => {
    api.get('/categories').then(({ data }) => setCategories(data.categories)).catch(() => {});
  }, []);

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams();
    if (category) params.set('category', category);
    if (search) params.set('search', search);
    if (sort) params.set('sort', sort);
    if (page) params.set('page', page);
    if (minPrice) params.set('minPrice', minPrice);
    if (maxPrice) params.set('maxPrice', maxPrice);
    if (ageGroup) params.set('ageGroup', ageGroup);
    if (featured) params.set('featured', featured);
    if (bestseller) params.set('bestseller', bestseller);
    if (newArrival) params.set('newArrival', newArrival);
    params.set('limit', '12');

    api.get(`/products?${params.toString()}`)
      .then(({ data }) => { setProducts(data.products); setPagination(data.pagination); })
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  }, [category, search, sort, page, minPrice, maxPrice, ageGroup, featured, bestseller, newArrival]);

  const activeFilters = [
    category && { key: 'category', label: categories.find(c => c.slug === category)?.name || category },
    ageGroup && { key: 'ageGroup', label: `Age: ${ageGroup}` },
    minPrice && { key: 'minPrice', label: `Min: LKR ${minPrice}` },
    maxPrice && { key: 'maxPrice', label: `Max: LKR ${maxPrice}` },
    featured === 'true' && { key: 'featured', label: 'Featured' },
    bestseller === 'true' && { key: 'bestseller', label: 'Best Sellers' },
    newArrival === 'true' && { key: 'newArrival', label: 'New Arrivals' },
  ].filter(Boolean);

  const FilterPanel = () => (
    <div className="space-y-6">
      {/* Categories */}
      <div>
        <h3 className="font-semibold text-gray-800 mb-3">Category</h3>
        <div className="space-y-1.5">
          <button
            onClick={() => setParam('category', '')}
            className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${!category ? 'bg-blue-50 text-blue-600 font-medium' : 'text-gray-600 hover:bg-gray-100'}`}
          >
            All Categories
          </button>
          {categories.map(cat => (
            <button
              key={cat.slug}
              onClick={() => setParam('category', cat.slug)}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors flex justify-between items-center ${category === cat.slug ? 'bg-blue-50 text-blue-600 font-medium' : 'text-gray-600 hover:bg-gray-100'}`}
            >
              {cat.name}
              <span className="text-xs bg-gray-200 text-gray-600 px-1.5 rounded-full">{cat.product_count}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div>
        <h3 className="font-semibold text-gray-800 mb-3">Price Range (LKR)</h3>
        <div className="flex gap-2">
          <input
            type="number"
            placeholder="Min"
            value={minPrice}
            onChange={e => setParam('minPrice', e.target.value)}
            className="input-field py-2 text-sm"
          />
          <input
            type="number"
            placeholder="Max"
            value={maxPrice}
            onChange={e => setParam('maxPrice', e.target.value)}
            className="input-field py-2 text-sm"
          />
        </div>
        <div className="grid grid-cols-2 gap-1.5 mt-2">
          {[['0','1000'], ['1000','3000'], ['3000','6000'], ['6000','']].map(([min, max]) => (
            <button
              key={`${min}-${max}`}
              onClick={() => { setParam('minPrice', min); setParam('maxPrice', max); }}
              className="text-xs border border-gray-200 hover:border-blue-500 hover:text-blue-600 rounded-lg px-2 py-1.5 transition-colors"
            >
              {min ? `LKR ${min}` : '0'} – {max ? `LKR ${max}` : '∞'}
            </button>
          ))}
        </div>
      </div>

      {/* Age Group */}
      <div>
        <h3 className="font-semibold text-gray-800 mb-3">Age Group</h3>
        <div className="flex flex-wrap gap-2">
          {AGE_GROUPS.map(ag => (
            <button
              key={ag}
              onClick={() => setParam('ageGroup', ageGroup === ag ? '' : ag)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${ageGroup === ag ? 'bg-blue-600 border-blue-600 text-white' : 'border-gray-200 text-gray-600 hover:border-blue-400 hover:text-blue-600'}`}
            >
              {ag}
            </button>
          ))}
        </div>
      </div>

      {/* Type */}
      <div>
        <h3 className="font-semibold text-gray-800 mb-3">Product Type</h3>
        <div className="space-y-1.5">
          {[['featured', 'Featured'], ['bestseller', 'Best Sellers'], ['newArrival', 'New Arrivals']].map(([key, label]) => (
            <label key={key} className="flex items-center gap-2.5 cursor-pointer group">
              <input
                type="checkbox"
                checked={searchParams.get(key) === 'true'}
                onChange={e => setParam(key, e.target.checked ? 'true' : '')}
                className="w-4 h-4 accent-blue-600"
              />
              <span className="text-sm text-gray-700 group-hover:text-blue-600 transition-colors">{label}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="container-custom py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            {search ? `Results for "${search}"` : category ? categories.find(c => c.slug === category)?.name || 'Products' : 'All Products'}
          </h1>
          {!loading && <p className="text-sm text-gray-500 mt-0.5">{pagination.total || 0} products found</p>}
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="lg:hidden flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-xl text-sm font-medium hover:border-blue-500 hover:text-blue-600 transition-colors"
          >
            <SlidersHorizontal size={16} /> Filters
            {activeFilters.length > 0 && <span className="bg-blue-600 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">{activeFilters.length}</span>}
          </button>
          <select
            value={sort}
            onChange={e => setParam('sort', e.target.value)}
            className="input-field py-2 text-sm w-48"
          >
            {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
        </div>
      </div>

      {/* Active filters */}
      {activeFilters.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {activeFilters.map(f => (
            <button
              key={f.key}
              onClick={() => setParam(f.key, '')}
              className="flex items-center gap-1.5 bg-blue-50 text-blue-700 text-xs font-medium px-3 py-1.5 rounded-full hover:bg-red-50 hover:text-red-600 transition-colors"
            >
              {f.label} <X size={12} />
            </button>
          ))}
          <button onClick={() => setSearchParams({})} className="text-xs text-gray-500 hover:text-red-500 px-2">Clear All</button>
        </div>
      )}

      <div className="flex gap-8">
        {/* Sidebar filters (desktop) */}
        <aside className="hidden lg:block w-64 shrink-0">
          <div className="card p-5 sticky top-24">
            <h2 className="font-bold text-gray-800 mb-5 flex items-center gap-2">
              <SlidersHorizontal size={16} /> Filters
            </h2>
            <FilterPanel />
          </div>
        </aside>

        {/* Mobile filters drawer */}
        {showFilters && (
          <div className="lg:hidden fixed inset-0 z-50 flex">
            <div className="absolute inset-0 bg-black/40" onClick={() => setShowFilters(false)} />
            <div className="relative ml-auto w-80 bg-white h-full overflow-y-auto p-5 shadow-xl">
              <div className="flex justify-between items-center mb-5">
                <h2 className="font-bold text-gray-800">Filters</h2>
                <button onClick={() => setShowFilters(false)}><X size={20} /></button>
              </div>
              <FilterPanel />
            </div>
          </div>
        )}

        {/* Products grid */}
        <div className="flex-1 min-w-0">
          <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4">
            {loading
              ? Array.from({ length: 12 }).map((_, i) => <ProductCardSkeleton key={i} />)
              : products.map(p => <ProductCard key={p.id} product={p} />)
            }
          </div>

          {!loading && products.length === 0 && (
            <div className="text-center py-20">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-xl font-semibold text-gray-700">No products found</h3>
              <p className="text-gray-500 mt-2">Try adjusting your filters or search terms</p>
            </div>
          )}

          {/* Pagination */}
          {pagination.pages > 1 && (
            <div className="flex justify-center gap-2 mt-10">
              {Array.from({ length: pagination.pages }, (_, i) => i + 1).map(p => (
                <button
                  key={p}
                  onClick={() => { const sp = new URLSearchParams(searchParams); sp.set('page', p); setSearchParams(sp); }}
                  className={`w-10 h-10 rounded-xl font-medium transition-colors ${p === page ? 'bg-blue-600 text-white' : 'bg-white border border-gray-200 text-gray-700 hover:border-blue-500 hover:text-blue-600'}`}
                >
                  {p}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
