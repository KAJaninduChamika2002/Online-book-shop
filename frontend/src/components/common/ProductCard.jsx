import { Link } from 'react-router-dom';
import { Heart, ShoppingCart, Star, Eye } from 'lucide-react';
import { useState } from 'react';
import { formatPrice, getDiscount } from '../../utils/helpers';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import api from '../../utils/api';
import toast from 'react-hot-toast';

export default function ProductCard({ product }) {
  const [wishlisted, setWishlisted] = useState(false);
  const [addingCart, setAddingCart] = useState(false);
  const { addToCart } = useCart();
  const { user } = useAuth();
  const discount = getDiscount(product.price, product.sale_price);

  const handleWishlist = async (e) => {
    e.preventDefault();
    if (!user) { toast.error('Please login to add to wishlist'); return; }
    try {
      const { data } = await api.post(`/wishlist/${product.id}`);
      setWishlisted(data.wishlisted);
      toast.success(data.wishlisted ? 'Added to wishlist!' : 'Removed from wishlist');
    } catch { toast.error('Failed to update wishlist'); }
  };

  const handleAddToCart = (e) => {
    e.preventDefault();
    setAddingCart(true);
    addToCart(product);
    setTimeout(() => setAddingCart(false), 600);
  };

  return (
    <Link to={`/product/${product.slug}`} className="group card block overflow-hidden">
      <div className="relative overflow-hidden bg-gray-50">
        <img
          src={product.thumbnail || 'https://via.placeholder.com/300x300?text=No+Image'}
          alt={product.name}
          className="w-full h-52 object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        {/* Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {discount > 0 && (
            <span className="badge bg-red-500 text-white">-{discount}%</span>
          )}
          {product.is_new_arrival && (
            <span className="badge bg-green-500 text-white">New</span>
          )}
          {product.is_bestseller && (
            <span className="badge bg-orange-500 text-white">Best Seller</span>
          )}
          {product.stock === 0 && (
            <span className="badge bg-gray-500 text-white">Out of Stock</span>
          )}
        </div>

        {/* Hover actions */}
        <div className="absolute top-2 right-2 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-4 group-hover:translate-x-0">
          <button onClick={handleWishlist}
            className={`w-9 h-9 rounded-xl shadow-md flex items-center justify-center transition-colors ${wishlisted ? 'bg-red-500 text-white' : 'bg-white text-gray-600 hover:bg-red-50 hover:text-red-500'}`}>
            <Heart size={16} fill={wishlisted ? 'currentColor' : 'none'} />
          </button>
          <button onClick={(e) => { e.preventDefault(); }}
            className="w-9 h-9 bg-white rounded-xl shadow-md flex items-center justify-center text-gray-600 hover:bg-blue-50 hover:text-blue-600 transition-colors">
            <Eye size={16} />
          </button>
        </div>
      </div>

      <div className="p-4">
        {product.category_name && (
          <span className="text-xs font-medium text-blue-500 uppercase tracking-wider">{product.category_name}</span>
        )}
        <h3 className="font-semibold text-gray-800 mt-1 leading-tight line-clamp-2 group-hover:text-blue-600 transition-colors">
          {product.name}
        </h3>

        {/* Rating */}
        {product.avg_rating > 0 && (
          <div className="flex items-center gap-1 mt-1.5">
            <div className="flex">
              {[1,2,3,4,5].map(s => (
                <Star key={s} size={12} className={s <= Math.round(product.avg_rating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-200 fill-gray-200'} />
              ))}
            </div>
            <span className="text-xs text-gray-400">({product.review_count})</span>
          </div>
        )}

        {product.age_group && (
          <div className="mt-1 text-xs text-gray-400">Age: {product.age_group}</div>
        )}

        <div className="flex items-center justify-between mt-3">
          <div>
            <span className="text-lg font-bold text-blue-600">
              {formatPrice(product.sale_price || product.price)}
            </span>
            {product.sale_price && (
              <span className="text-sm text-gray-400 line-through ml-2">{formatPrice(product.price)}</span>
            )}
          </div>
          <button
            onClick={handleAddToCart}
            disabled={product.stock === 0 || addingCart}
            className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-200 ${
              product.stock === 0 ? 'bg-gray-200 text-gray-400 cursor-not-allowed' :
              addingCart ? 'bg-green-500 text-white scale-95' : 'bg-blue-100 text-blue-600 hover:bg-blue-600 hover:text-white'
            }`}
          >
            <ShoppingCart size={18} />
          </button>
        </div>
      </div>
    </Link>
  );
}
