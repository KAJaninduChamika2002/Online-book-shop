import { Link } from 'react-router-dom';

const CATEGORIES = [
  { name: 'Toys', slug: 'toys', icon: '🧸', color: 'bg-yellow-50 hover:bg-yellow-100 border-yellow-200', text: 'text-yellow-700' },
  { name: 'School Bags', slug: 'school-bags', icon: '🎒', color: 'bg-blue-50 hover:bg-blue-100 border-blue-200', text: 'text-blue-700' },
  { name: 'Stationery', slug: 'stationery', icon: '✏️', color: 'bg-purple-50 hover:bg-purple-100 border-purple-200', text: 'text-purple-700' },
  { name: 'Books', slug: 'books', icon: '📚', color: 'bg-green-50 hover:bg-green-100 border-green-200', text: 'text-green-700' },
  { name: 'Art Supplies', slug: 'art-supplies', icon: '🎨', color: 'bg-pink-50 hover:bg-pink-100 border-pink-200', text: 'text-pink-700' },
  { name: 'Water Bottles', slug: 'water-bottles', icon: '💧', color: 'bg-cyan-50 hover:bg-cyan-100 border-cyan-200', text: 'text-cyan-700' },
  { name: 'Edu Games', slug: 'educational-games', icon: '🎮', color: 'bg-orange-50 hover:bg-orange-100 border-orange-200', text: 'text-orange-700' },
  { name: 'Accessories', slug: 'accessories', icon: '🌟', color: 'bg-red-50 hover:bg-red-100 border-red-200', text: 'text-red-700' },
];

export default function CategorySection() {
  return (
    <section className="py-14 bg-white">
      <div className="container-custom">
        <div className="text-center mb-10">
          <h2 className="section-title">Shop by Category</h2>
          <p className="text-gray-500 mt-2">Find exactly what you're looking for</p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
          {CATEGORIES.map(cat => (
            <Link
              key={cat.slug}
              to={`/shop?category=${cat.slug}`}
              className={`${cat.color} border-2 rounded-2xl p-4 flex flex-col items-center gap-2 transition-all duration-200 hover:shadow-md hover:-translate-y-1 group`}
            >
              <span className="text-4xl group-hover:scale-110 transition-transform duration-200">{cat.icon}</span>
              <span className={`text-xs font-semibold text-center ${cat.text} leading-tight`}>{cat.name}</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
