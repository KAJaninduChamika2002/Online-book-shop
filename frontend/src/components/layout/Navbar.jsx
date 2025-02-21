import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, Heart, User, Search, Menu, X, ChevronDown, LogOut, Package, Settings } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import api from '../../utils/api';
import { debounce } from '../../utils/helpers';

const CATEGORIES = [
  { name: 'Toys', slug: 'toys', icon: '🧸' },
  { name: 'School Bags', slug: 'school-bags', icon: '🎒' },
  { name: 'Stationery', slug: 'stationery', icon: '✏️' },
  { name: 'Books', slug: 'books', icon: '📚' },
  { name: 'Art Supplies', slug: 'art-supplies', icon: '🎨' },
  { name: 'Water Bottles', slug: 'water-bottles', icon: '💧' },
  { name: 'Educational Games', slug: 'educational-games', icon: '🎮' },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [catMenuOpen, setCatMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { totalItems } = useCart();
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const searchRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const fetchSuggestions = debounce(async (q) => {
    if (q.length < 2) { setSuggestions([]); return; }
    try {
      const { data } = await api.get(`/products/search/suggestions?q=${q}`);
      setSuggestions(data.suggestions);
      setShowSuggestions(true);
    } catch { setSuggestions([]); }
  }, 300);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchQuery)}`);
      setShowSuggestions(false);
    }
  };

  return (
    <header className={`sticky top-0 z-50 transition-shadow duration-300 ${scrolled ? 'shadow-md' : ''}`}>
      {/* Top bar */}
      <div className="bg-blue-600 text-white text-xs py-1.5 text-center">
        🚚 Free shipping on orders above LKR 3,000 | 📞 +94 77 123 4567
      </div>

      {/* Main navbar */}
      <nav className="bg-white border-b border-gray-100">
        <div className="container-custom py-3">
          <div className="flex items-center gap-4">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 shrink-0">
              <span className="text-3xl">🧸</span>
              <div>
                <span className="text-xl font-bold text-blue-600">ToyShop</span>
                <span className="text-xl font-bold text-orange-500">LK</span>
                <div className="text-xs text-gray-400 -mt-1 leading-none">Toys & School Items</div>
              </div>
            </Link>

            {/* Search */}
            <div className="flex-1 max-w-xl mx-4 relative" ref={searchRef}>
              <form onSubmit={handleSearch}>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search toys, bags, stationery..."
                    value={searchQuery}
                    onChange={(e) => { setSearchQuery(e.target.value); fetchSuggestions(e.target.value); }}
                    onFocus={() => suggestions.length && setShowSuggestions(true)}
                    onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                    className="w-full pl-4 pr-12 py-2.5 border-2 border-blue-100 focus:border-blue-500 rounded-xl outline-none text-sm transition-colors"
                  />
                  <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 text-blue-500 hover:text-blue-600">
                    <Search size={18} />
                  </button>
                </div>
              </form>
              {showSuggestions && suggestions.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-100 rounded-xl shadow-xl z-50 overflow-hidden">
                  {suggestions.map(s => (
                    <Link
                      key={s.id}
                      to={`/product/${s.slug}`}
                      className="flex items-center gap-3 px-4 py-2.5 hover:bg-blue-50 transition-colors"
                      onClick={() => setShowSuggestions(false)}
                    >
                      <img src={s.thumbnail} alt={s.name} className="w-9 h-9 rounded-lg object-cover" />
                      <div>
                        <div className="text-sm font-medium text-gray-800">{s.name}</div>
                        <div className="text-xs text-blue-600">LKR {s.sale_price || s.price}</div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3 shrink-0">
              {/* Wishlist */}
              {user && (
                <Link to="/wishlist" className="p-2 text-gray-600 hover:text-red-500 transition-colors relative">
                  <Heart size={22} />
                </Link>
              )}

              {/* Cart */}
              <Link to="/cart" className="relative p-2 text-gray-600 hover:text-blue-600 transition-colors">
                <ShoppingCart size={22} />
                {totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold animate-bounce-soft">
                    {totalItems}
                  </span>
                )}
              </Link>

              {/* User */}
              {user ? (
                <div className="relative">
                  <button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-gray-100 transition-colors"
                  >
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-semibold text-sm">
                      {user.name?.charAt(0).toUpperCase()}
                    </div>
                    <ChevronDown size={14} className={`text-gray-500 transition-transform ${userMenuOpen ? 'rotate-180' : ''}`} />
                  </button>
                  {userMenuOpen && (
                    <div className="absolute right-0 top-full mt-2 w-52 bg-white rounded-xl shadow-xl border border-gray-100 py-1 z-50 animate-fade-in">
                      <div className="px-4 py-2.5 border-b border-gray-100">
                        <div className="font-semibold text-sm text-gray-800">{user.name}</div>
                        <div className="text-xs text-gray-400">{user.email}</div>
                      </div>
                      <Link to="/profile" className="flex items-center gap-2.5 px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600" onClick={() => setUserMenuOpen(false)}>
                        <User size={15} /> My Profile
                      </Link>
                      <Link to="/orders" className="flex items-center gap-2.5 px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600" onClick={() => setUserMenuOpen(false)}>
                        <Package size={15} /> My Orders
                      </Link>
                      {isAdmin && (
                        <Link to="/admin" className="flex items-center gap-2.5 px-4 py-2 text-sm text-purple-700 hover:bg-purple-50" onClick={() => setUserMenuOpen(false)}>
                          <Settings size={15} /> Admin Panel
                        </Link>
                      )}
                      <div className="border-t border-gray-100 mt-1">
                        <button onClick={() => { logout(); setUserMenuOpen(false); navigate('/'); }}
                          className="flex items-center gap-2.5 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50">
                          <LogOut size={15} /> Logout
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <Link to="/login" className="btn-primary text-sm py-2 px-4">
                  <User size={16} /> Login
                </Link>
              )}

              {/* Mobile menu */}
              <button className="md:hidden p-2 text-gray-600" onClick={() => setMobileOpen(!mobileOpen)}>
                {mobileOpen ? <X size={22} /> : <Menu size={22} />}
              </button>
            </div>
          </div>
        </div>

        {/* Category bar */}
        <div className="hidden md:block bg-gray-50 border-t border-gray-100">
          <div className="container-custom">
            <div className="flex items-center gap-1 overflow-x-auto scrollbar-none py-1">
              <Link to="/shop" className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-white rounded-lg transition-colors whitespace-nowrap">
                All Products
              </Link>
              {CATEGORIES.map(cat => (
                <Link
                  key={cat.slug}
                  to={`/shop?category=${cat.slug}`}
                  className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-white rounded-lg transition-colors whitespace-nowrap"
                >
                  <span>{cat.icon}</span> {cat.name}
                </Link>
              ))}
              <Link to="/shop?sort=price_asc" className="px-3 py-2 text-sm font-medium text-orange-600 hover:bg-orange-50 rounded-lg transition-colors whitespace-nowrap ml-auto">
                🔥 Sale
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 shadow-lg animate-fade-in">
          <div className="container-custom py-4 space-y-1">
            {CATEGORIES.map(cat => (
              <Link
                key={cat.slug}
                to={`/shop?category=${cat.slug}`}
                className="flex items-center gap-3 px-3 py-2.5 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-xl"
                onClick={() => setMobileOpen(false)}
              >
                <span className="text-lg">{cat.icon}</span>
                <span className="font-medium">{cat.name}</span>
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
