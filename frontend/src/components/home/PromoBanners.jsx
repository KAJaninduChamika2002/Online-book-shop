import { Link } from 'react-router-dom';

const BANNERS = [
  {
    title: 'Back to School',
    subtitle: 'Everything your child needs',
    tag: 'Up to 30% off',
    link: '/shop?category=stationery',
    bg: 'bg-gradient-to-r from-blue-500 to-blue-700',
    icon: '🎒',
  },
  {
    title: 'Bundle Deals',
    subtitle: 'Bag + Bottle + Books combo',
    tag: 'Save LKR 500',
    link: '/shop',
    bg: 'bg-gradient-to-r from-orange-500 to-orange-700',
    icon: '🎁',
  },
  {
    title: 'New Toy Arrivals',
    subtitle: 'Fresh picks for every age',
    tag: 'Just arrived',
    link: '/shop?newArrival=true',
    bg: 'bg-gradient-to-r from-purple-500 to-purple-700',
    icon: '🧸',
  },
];

export default function PromoBanners() {
  return (
    <section className="py-10 bg-gray-50">
      <div className="container-custom">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {BANNERS.map((b, i) => (
            <Link
              key={i}
              to={b.link}
              className={`${b.bg} rounded-2xl p-6 text-white flex items-center justify-between hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group`}
            >
              <div>
                <div className="inline-block bg-white/20 text-white text-xs font-bold px-2.5 py-0.5 rounded-full mb-2">
                  {b.tag}
                </div>
                <h3 className="text-xl font-bold">{b.title}</h3>
                <p className="text-white/80 text-sm mt-0.5">{b.subtitle}</p>
                <div className="mt-4 inline-flex items-center gap-1.5 bg-white/20 hover:bg-white/30 px-4 py-1.5 rounded-lg text-sm font-semibold transition-colors">
                  Shop Now →
                </div>
              </div>
              <span className="text-6xl opacity-80 group-hover:scale-110 transition-transform duration-300">
                {b.icon}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
