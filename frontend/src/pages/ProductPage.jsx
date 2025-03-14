import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ShoppingCart, Heart, Star, Truck, Shield, RotateCcw, Minus, Plus, ChevronRight } from 'lucide-react';
import ProductCard from '../components/common/ProductCard';
import StarRating from '../components/common/StarRating';
import { formatPrice } from '../utils/helpers';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import toast from 'react-hot-toast';

export default function ProductPage() {
  const { slug } = useParams();
  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState(1);
  const [activeImg, setActiveImg] = useState(0);
  const [wishlisted, setWishlisted] = useState(false);
  const [reviewForm, setReviewForm] = useState({ rating: 5, title: '', comment: '' });
  const [activeTab, setActiveTab] = useState('description');
  const { addToCart } = useCart();
  const { user } = useAuth();

  useEffect(() => {
    setLoading(true);
    setActiveImg(0);
    setQty(1);
    Promise.all([
      api.get(`/products/${slug}`),
    ]).then(([{ data }]) => {
      setProduct(data.product);
      setRelated(data.related);
      return api.get(`/reviews/product/${data.product.id}`);
    }).then(({ data }) => {
      setReviews(data.reviews);
    }).catch(() => toast.error('Product not found'))
    .finally(() => setLoading(false));
  }, [slug]);

  const handleWishlist = async () => {
    if (!user) { toast.error('Please login first'); return; }
    try {
      const { data } = await api.post(`/wishlist/${product.id}`);
      setWishlisted(data.wishlisted);
      toast.success(data.wishlisted ? 'Added to wishlist!' : 'Removed from wishlist');
    } catch { toast.error('Failed'); }
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!user) { toast.error('Please login to review'); return; }
    try {
      await api.post(`/reviews/product/${product.id}`, reviewForm);
      toast.success('Review submitted for approval!');
      setReviewForm({ rating: 5, title: '', comment: '' });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit review');
    }
  };

  if (loading) {
    return (
      <div className="container-custom py-10">
        <div className="grid md:grid-cols-2 gap-10">
          <div className="space-y-3">
            <div className="skeleton h-96 rounded-2xl" />
            <div className="flex gap-2">{[...Array(4)].map((_, i) => <div key={i} className="skeleton h-20 w-20 rounded-xl" />)}</div>
          </div>
          <div className="space-y-4">
            <div className="skeleton h-8 w-3/4" />
            <div className="skeleton h-6 w-32" />
            <div className="skeleton h-10 w-48" />
            <div className="skeleton h-24 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) return <div className="text-center py-20 text-gray-500">Product not found.</div>;

  const images = product.images || [product.thumbnail];
  const finalPrice = product.sale_price || product.price;
  const discount = product.sale_price ? Math.round(((product.price - product.sale_price) / product.price) * 100) : 0;

  return (
    <div>
      <div className="container-custom py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
          <Link to="/" className="hover:text-blue-600">Home</Link>
          <ChevronRight size={14} />
          <Link to="/shop" className="hover:text-blue-600">Shop</Link>
          {product.category_name && <>
            <ChevronRight size={14} />
            <Link to={`/shop?category=${product.category_slug}`} className="hover:text-blue-600">{product.category_name}</Link>
          </>}
          <ChevronRight size={14} />
          <span className="text-gray-800 font-medium truncate max-w-48">{product.name}</span>
        </nav>

        <div className="grid md:grid-cols-2 gap-10 lg:gap-16">
          {/* Image gallery */}
          <div>
            <div className="relative overflow-hidden rounded-2xl bg-gray-50 border border-gray-100 mb-3">
              <img
                src={images[activeImg] || product.thumbnail}
                alt={product.name}
                className="w-full h-80 md:h-[440px] object-contain p-4"
              />
              {discount > 0 && (
                <div className="absolute top-4 left-4 bg-red-500 text-white font-bold text-sm px-3 py-1.5 rounded-xl">
                  -{discount}% OFF
                </div>
              )}
            </div>
            {images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-1">
                {images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImg(i)}
                    className={`shrink-0 w-20 h-20 rounded-xl overflow-hidden border-2 transition-colors ${i === activeImg ? 'border-blue-500' : 'border-gray-200 hover:border-blue-300'}`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product info */}
          <div>
            {product.brand_name && <div className="text-sm font-medium text-blue-500 mb-1">{product.brand_name}</div>}
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800 leading-tight mb-3">{product.name}</h1>

            <div className="flex items-center gap-3 mb-4">
              <StarRating rating={product.avg_rating} size={18} showCount count={product.review_count} />
              {product.age_group && (
                <span className="badge bg-blue-100 text-blue-700">Age: {product.age_group}</span>
              )}
            </div>

            <div className="flex items-end gap-3 mb-5">
              <span className="text-3xl font-extrabold text-blue-600">{formatPrice(finalPrice)}</span>
              {product.sale_price && (
                <span className="text-xl text-gray-400 line-through">{formatPrice(product.price)}</span>
              )}
              {discount > 0 && <span className="badge bg-red-100 text-red-600 text-sm">Save {formatPrice(product.price - product.sale_price)}</span>}
            </div>

            {product.short_description && (
              <p className="text-gray-600 leading-relaxed mb-6">{product.short_description}</p>
            )}

            {/* Stock */}
            <div className={`flex items-center gap-2 mb-5 text-sm font-medium ${product.stock > 0 ? 'text-green-600' : 'text-red-500'}`}>
              <div className={`w-2 h-2 rounded-full ${product.stock > 0 ? 'bg-green-500' : 'bg-red-500'}`} />
              {product.stock > 0 ? `In Stock (${product.stock} available)` : 'Out of Stock'}
              {product.stock > 0 && product.stock <= 5 && <span className="text-orange-500 ml-2">⚡ Only {product.stock} left!</span>}
            </div>

            {/* Quantity & Add to cart */}
            {product.stock > 0 && (
              <div className="flex flex-col sm:flex-row gap-3 mb-6">
                <div className="flex items-center border-2 border-gray-200 rounded-xl overflow-hidden w-36">
                  <button onClick={() => setQty(q => Math.max(1, q - 1))} className="px-4 py-3 hover:bg-gray-100 transition-colors">
                    <Minus size={16} />
                  </button>
                  <span className="flex-1 text-center font-semibold">{qty}</span>
                  <button onClick={() => setQty(q => Math.min(product.stock, q + 1))} className="px-4 py-3 hover:bg-gray-100 transition-colors">
                    <Plus size={16} />
                  </button>
                </div>
                <button
                  onClick={() => addToCart(product, qty)}
                  className="btn-primary flex-1 justify-center py-3"
                >
                  <ShoppingCart size={18} /> Add to Cart
                </button>
                <button
                  onClick={handleWishlist}
                  className={`w-12 h-12 rounded-xl border-2 flex items-center justify-center transition-colors ${wishlisted ? 'border-red-500 bg-red-50 text-red-500' : 'border-gray-200 hover:border-red-400 hover:text-red-500'}`}
                >
                  <Heart size={20} fill={wishlisted ? 'currentColor' : 'none'} />
                </button>
              </div>
            )}

            {/* Trust badges */}
            <div className="grid grid-cols-3 gap-3 border-t border-gray-100 pt-5">
              {[
                [Truck, 'Free Delivery', 'Orders above LKR 3,000'],
                [Shield, 'Quality Assured', 'Safety tested products'],
                [RotateCcw, '7-Day Returns', 'Hassle-free policy'],
              ].map(([Icon, title, sub]) => (
                <div key={title} className="flex flex-col items-center text-center p-3 bg-gray-50 rounded-xl">
                  <Icon size={20} className="text-blue-500 mb-1.5" />
                  <div className="text-xs font-semibold text-gray-700">{title}</div>
                  <div className="text-xs text-gray-400 mt-0.5">{sub}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mt-14">
          <div className="flex gap-1 border-b border-gray-200 mb-6">
            {['description', 'reviews'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-3 font-semibold text-sm capitalize transition-colors border-b-2 -mb-px ${activeTab === tab ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
              >
                {tab} {tab === 'reviews' && `(${reviews.length})`}
              </button>
            ))}
          </div>

          {activeTab === 'description' && (
            <div className="prose max-w-none text-gray-600 leading-relaxed">
              <p>{product.description}</p>
              {product.age_group && <p className="mt-4"><strong>Suitable for:</strong> Ages {product.age_group}</p>}
              {product.weight && <p><strong>Weight:</strong> {product.weight}kg</p>}
              {product.dimensions && <p><strong>Dimensions:</strong> {product.dimensions}</p>}
              {product.sku && <p><strong>SKU:</strong> {product.sku}</p>}
            </div>
          )}

          {activeTab === 'reviews' && (
            <div className="space-y-6">
              {reviews.length === 0 && <p className="text-gray-400">No reviews yet. Be the first!</p>}
              {reviews.map(r => (
                <div key={r.id} className="card p-5">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center font-bold text-blue-600">
                        {r.user_name?.charAt(0)}
                      </div>
                      <div>
                        <div className="font-semibold text-gray-800">{r.user_name}</div>
                        <StarRating rating={r.rating} size={14} />
                      </div>
                    </div>
                    <span className="text-xs text-gray-400">{new Date(r.created_at).toLocaleDateString()}</span>
                  </div>
                  {r.title && <div className="font-medium text-gray-800 mt-3">{r.title}</div>}
                  <p className="text-gray-600 text-sm mt-1 leading-relaxed">{r.comment}</p>
                </div>
              ))}

              {/* Review form */}
              {user && (
                <div className="card p-6 border-2 border-blue-100">
                  <h3 className="font-bold text-gray-800 mb-4">Write a Review</h3>
                  <form onSubmit={handleSubmitReview} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Your Rating</label>
                      <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map(s => (
                          <button
                            type="button"
                            key={s}
                            onClick={() => setReviewForm(f => ({ ...f, rating: s }))}
                            className="text-2xl transition-transform hover:scale-110"
                          >
                            <Star size={28} className={s <= reviewForm.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300 fill-gray-300'} />
                          </button>
                        ))}
                      </div>
                    </div>
                    <input
                      type="text"
                      placeholder="Review title..."
                      value={reviewForm.title}
                      onChange={e => setReviewForm(f => ({ ...f, title: e.target.value }))}
                      className="input-field"
                    />
                    <textarea
                      rows={4}
                      required
                      placeholder="Share your experience with this product..."
                      value={reviewForm.comment}
                      onChange={e => setReviewForm(f => ({ ...f, comment: e.target.value }))}
                      className="input-field resize-none"
                    />
                    <button type="submit" className="btn-primary">Submit Review</button>
                  </form>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Related products */}
        {related.length > 0 && (
          <div className="mt-16">
            <h2 className="section-title mb-6">You May Also Like</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {related.map(p => <ProductCard key={p.id} product={p} />)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
