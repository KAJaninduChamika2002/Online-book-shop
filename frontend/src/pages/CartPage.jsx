import { Link, useNavigate } from 'react-router-dom';
import { Trash2, Minus, Plus, ShoppingBag, ArrowRight, Tag } from 'lucide-react';
import { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { formatPrice } from '../utils/helpers';
import api from '../utils/api';
import toast from 'react-hot-toast';

export default function CartPage() {
  const { items, removeFromCart, updateQty, subtotal, shipping, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [coupon, setCoupon] = useState('');
  const [couponData, setCouponData] = useState(null);
  const [couponLoading, setCouponLoading] = useState(false);

  const applyCoupon = async () => {
    if (!coupon.trim()) return;
    if (!user) { toast.error('Please login to use coupons'); return; }
    setCouponLoading(true);
    try {
      const { data } = await api.post('/coupons/validate', { code: coupon.toUpperCase(), subtotal });
      setCouponData(data.coupon);
      toast.success(`Coupon applied! You save ${formatPrice(data.coupon.calculated_discount)}`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Invalid coupon');
      setCouponData(null);
    } finally {
      setCouponLoading(false);
    }
  };

  const discount = couponData?.calculated_discount || 0;
  const total = subtotal - discount + shipping;

  if (items.length === 0) {
    return (
      <div className="container-custom py-24 text-center">
        <div className="text-8xl mb-6">🛒</div>
        <h2 className="text-2xl font-bold text-gray-700 mb-3">Your cart is empty</h2>
        <p className="text-gray-500 mb-8">Looks like you haven't added anything yet!</p>
        <Link to="/shop" className="btn-primary inline-flex">
          <ShoppingBag size={18} /> Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="container-custom py-10">
      <h1 className="text-2xl font-bold text-gray-800 mb-8">Shopping Cart <span className="text-gray-400 font-normal text-lg">({items.length} items)</span></h1>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Items */}
        <div className="lg:col-span-2 space-y-4">
          {items.map(item => (
            <div key={item.id} className="card p-4 flex gap-4">
              <Link to={`/product/${item.slug}`} className="shrink-0">
                <img
                  src={item.thumbnail}
                  alt={item.name}
                  className="w-24 h-24 object-cover rounded-xl bg-gray-50"
                />
              </Link>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between gap-2">
                  <Link to={`/product/${item.slug}`} className="font-semibold text-gray-800 hover:text-blue-600 transition-colors line-clamp-2 leading-tight">
                    {item.name}
                  </Link>
                  <button onClick={() => removeFromCart(item.id)} className="text-gray-400 hover:text-red-500 transition-colors shrink-0 p-1">
                    <Trash2 size={16} />
                  </button>
                </div>
                {item.category_name && <div className="text-xs text-gray-400 mt-0.5">{item.category_name}</div>}
                <div className="flex items-center justify-between mt-3">
                  <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden">
                    <button
                      onClick={() => item.qty === 1 ? removeFromCart(item.id) : updateQty(item.id, item.qty - 1)}
                      className="px-3 py-1.5 hover:bg-gray-100 transition-colors"
                    >
                      <Minus size={14} />
                    </button>
                    <span className="px-4 font-semibold text-sm">{item.qty}</span>
                    <button
                      onClick={() => updateQty(item.id, Math.min(item.stock || 99, item.qty + 1))}
                      className="px-3 py-1.5 hover:bg-gray-100 transition-colors"
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-blue-600">{formatPrice((item.sale_price || item.price) * item.qty)}</div>
                    {item.qty > 1 && <div className="text-xs text-gray-400">{formatPrice(item.sale_price || item.price)} each</div>}
                  </div>
                </div>
              </div>
            </div>
          ))}
          <div className="flex justify-between items-center pt-2">
            <Link to="/shop" className="text-blue-600 hover:text-blue-700 text-sm font-medium">← Continue Shopping</Link>
            <button onClick={clearCart} className="text-red-500 hover:text-red-600 text-sm font-medium">Clear Cart</button>
          </div>
        </div>

        {/* Summary */}
        <div className="space-y-4">
          {/* Coupon */}
          <div className="card p-5">
            <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2"><Tag size={16} /> Coupon Code</h3>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Enter coupon code"
                value={coupon}
                onChange={e => setCoupon(e.target.value.toUpperCase())}
                className="input-field py-2.5 text-sm flex-1"
              />
              <button onClick={applyCoupon} disabled={couponLoading} className="btn-primary py-2.5 px-4 text-sm">
                Apply
              </button>
            </div>
            {couponData && (
              <div className="mt-2 flex justify-between items-center text-sm">
                <span className="text-green-600 font-medium">✓ {couponData.code} applied!</span>
                <button onClick={() => { setCouponData(null); setCoupon(''); }} className="text-red-500 text-xs">Remove</button>
              </div>
            )}
            <div className="mt-3 flex flex-wrap gap-1.5">
              {['WELCOME10', 'SCHOOL20', 'TOYS15'].map(c => (
                <button key={c} onClick={() => setCoupon(c)} className="text-xs bg-gray-100 hover:bg-blue-50 hover:text-blue-600 px-2.5 py-1 rounded-lg transition-colors font-medium">
                  {c}
                </button>
              ))}
            </div>
          </div>

          {/* Order summary */}
          <div className="card p-5">
            <h3 className="font-semibold text-gray-800 mb-4">Order Summary</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal ({items.reduce((s, i) => s + i.qty, 0)} items)</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-green-600 font-medium">
                  <span>Discount</span>
                  <span>-{formatPrice(discount)}</span>
                </div>
              )}
              <div className="flex justify-between text-gray-600">
                <span>Shipping</span>
                <span className={shipping === 0 ? 'text-green-600 font-medium' : ''}>{shipping === 0 ? 'FREE' : formatPrice(shipping)}</span>
              </div>
              {shipping > 0 && (
                <div className="text-xs text-gray-400 bg-blue-50 px-3 py-2 rounded-lg">
                  Add {formatPrice(3000 - subtotal)} more for free shipping!
                </div>
              )}
              <div className="border-t border-gray-100 pt-3 flex justify-between font-bold text-lg">
                <span>Total</span>
                <span className="text-blue-600">{formatPrice(total)}</span>
              </div>
            </div>
            <button
              onClick={() => user ? navigate('/checkout', { state: { discount, couponCode: coupon, couponId: couponData?.id } }) : navigate('/login')}
              className="btn-primary w-full justify-center mt-5 py-3"
            >
              {user ? 'Proceed to Checkout' : 'Login to Checkout'} <ArrowRight size={18} />
            </button>
            <div className="flex items-center justify-center gap-4 mt-4 text-xs text-gray-400">
              <span>🔒 Secure Checkout</span>
              <span>💳 Multiple Payments</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
