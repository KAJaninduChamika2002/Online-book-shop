import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingCart, Trash2 } from 'lucide-react';
import api from '../utils/api';
import { formatPrice } from '../utils/helpers';
import { useCart } from '../context/CartContext';
import toast from 'react-hot-toast';

export default function WishlistPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();

  const fetchWishlist = () => {
    api.get('/wishlist').then(({ data }) => setItems(data.items)).finally(() => setLoading(false));
  };

  useEffect(fetchWishlist, []);

  const remove = async (productId) => {
    await api.delete(`/wishlist/${productId}`);
    setItems(prev => prev.filter(i => i.product_id !== productId));
    toast.success('Removed from wishlist');
  };

  return (
    <div className="container-custom py-10 max-w-4xl">
      <h1 className="text-2xl font-bold text-gray-800 mb-8 flex items-center gap-2">
        <Heart className="text-red-500 fill-red-500" size={24} /> My Wishlist
        <span className="text-gray-400 font-normal text-lg">({items.length})</span>
      </h1>

      {loading ? (
        <div className="grid sm:grid-cols-2 gap-4">
          {[...Array(4)].map((_, i) => <div key={i} className="skeleton h-32 rounded-2xl" />)}
        </div>
      ) : items.length === 0 ? (
        <div className="text-center py-16">
          <Heart size={48} className="mx-auto text-gray-200 mb-4" />
          <p className="text-gray-500">Your wishlist is empty.</p>
          <Link to="/shop" className="btn-primary mt-4 inline-flex">Discover Products</Link>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 gap-4">
          {items.map(item => (
            <div key={item.id} className="card p-4 flex gap-4">
              <Link to={`/product/${item.slug}`}>
                <img src={item.thumbnail} alt={item.name} className="w-24 h-24 object-cover rounded-xl bg-gray-50" />
              </Link>
              <div className="flex-1 min-w-0">
                <Link to={`/product/${item.slug}`} className="font-semibold text-gray-800 hover:text-blue-600 line-clamp-2 text-sm leading-tight">
                  {item.name}
                </Link>
                <div className="text-blue-600 font-bold mt-1">{formatPrice(item.sale_price || item.price)}</div>
                <div className={`text-xs mt-1 font-medium ${item.stock > 0 ? 'text-green-600' : 'text-red-500'}`}>
                  {item.stock > 0 ? 'In Stock' : 'Out of Stock'}
                </div>
                <div className="flex gap-2 mt-3">
                  <button
                    onClick={() => item.stock > 0 && addToCart(item)}
                    disabled={item.stock === 0}
                    className="btn-primary py-1.5 px-3 text-xs"
                  >
                    <ShoppingCart size={14} /> Add to Cart
                  </button>
                  <button onClick={() => remove(item.product_id)} className="p-1.5 text-gray-400 hover:text-red-500 transition-colors">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
