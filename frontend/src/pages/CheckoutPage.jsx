import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { CreditCard, Truck, CheckCircle } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { formatPrice } from '../utils/helpers';
import api from '../utils/api';
import toast from 'react-hot-toast';

const STEPS = ['Address', 'Payment', 'Review'];

export default function CheckoutPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { items, subtotal, shipping, clearCart } = useCart();
  const { user } = useAuth();
  const { discount = 0, couponCode = '', couponId = null } = location.state || {};
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    shipping_name: user?.name || '',
    shipping_email: user?.email || '',
    shipping_phone: '',
    shipping_address: '',
    shipping_city: '',
    shipping_state: '',
    shipping_zip: '',
    payment_method: 'cod',
    notes: '',
  });

  const total = subtotal - discount + shipping;

  const update = (key, value) => setForm(f => ({ ...f, [key]: value }));

  const handlePlaceOrder = async () => {
    setLoading(true);
    try {
      const { data } = await api.post('/orders', {
        items: items.map(i => ({ product_id: i.id, quantity: i.qty })),
        coupon_code: couponCode || undefined,
        ...form,
      });
      clearCart();
      toast.success('Order placed successfully! 🎉');
      navigate(`/order-success/${data.orderId}`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-custom py-10 max-w-5xl">
      <h1 className="text-2xl font-bold text-gray-800 mb-8">Checkout</h1>

      {/* Steps */}
      <div className="flex items-center gap-0 mb-10">
        {STEPS.map((s, i) => (
          <div key={s} className="flex items-center flex-1">
            <div className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold transition-colors ${i <= step ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-500'}`}>
              {i < step ? <CheckCircle size={16} /> : i + 1}
            </div>
            <span className={`ml-2 text-sm font-medium hidden sm:block ${i <= step ? 'text-blue-600' : 'text-gray-400'}`}>{s}</span>
            {i < STEPS.length - 1 && (
              <div className={`flex-1 h-0.5 mx-3 ${i < step ? 'bg-blue-600' : 'bg-gray-200'}`} />
            )}
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {/* Step 0: Address */}
          {step === 0 && (
            <div className="card p-6">
              <h2 className="font-bold text-gray-800 mb-5 flex items-center gap-2"><Truck size={18} /> Delivery Address</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Full Name *</label>
                  <input value={form.shipping_name} onChange={e => update('shipping_name', e.target.value)} className="input-field" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
                  <input type="email" value={form.shipping_email} onChange={e => update('shipping_email', e.target.value)} className="input-field" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Phone *</label>
                  <input value={form.shipping_phone} onChange={e => update('shipping_phone', e.target.value)} className="input-field" required />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Street Address *</label>
                  <textarea rows={2} value={form.shipping_address} onChange={e => update('shipping_address', e.target.value)} className="input-field resize-none" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">City *</label>
                  <input value={form.shipping_city} onChange={e => update('shipping_city', e.target.value)} className="input-field" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Province</label>
                  <select value={form.shipping_state} onChange={e => update('shipping_state', e.target.value)} className="input-field">
                    <option value="">Select Province</option>
                    {['Western','Central','Southern','Northern','Eastern','North Western','North Central','Uva','Sabaragamuwa'].map(p => <option key={p}>{p}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Postal Code</label>
                  <input value={form.shipping_zip} onChange={e => update('shipping_zip', e.target.value)} className="input-field" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Order Notes</label>
                  <input placeholder="Special instructions..." value={form.notes} onChange={e => update('notes', e.target.value)} className="input-field" />
                </div>
              </div>
              <button
                onClick={() => { if (!form.shipping_name || !form.shipping_phone || !form.shipping_address || !form.shipping_city) { toast.error('Please fill required fields'); return; } setStep(1); }}
                className="btn-primary mt-6"
              >
                Continue to Payment →
              </button>
            </div>
          )}

          {/* Step 1: Payment */}
          {step === 1 && (
            <div className="card p-6">
              <h2 className="font-bold text-gray-800 mb-5 flex items-center gap-2"><CreditCard size={18} /> Payment Method</h2>
              <div className="space-y-3">
                {[
                  { value: 'cod', label: 'Cash on Delivery', icon: '💵', desc: 'Pay when your order arrives' },
                  { value: 'card', label: 'Credit / Debit Card', icon: '💳', desc: 'Visa, Mastercard, Amex' },
                  { value: 'bank', label: 'Bank Transfer', icon: '🏦', desc: 'Transfer to our bank account' },
                ].map(m => (
                  <label
                    key={m.value}
                    className={`flex items-center gap-4 p-4 border-2 rounded-xl cursor-pointer transition-colors ${form.payment_method === m.value ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-blue-300'}`}
                  >
                    <input
                      type="radio"
                      name="payment"
                      value={m.value}
                      checked={form.payment_method === m.value}
                      onChange={() => update('payment_method', m.value)}
                      className="accent-blue-600"
                    />
                    <span className="text-2xl">{m.icon}</span>
                    <div>
                      <div className="font-semibold text-gray-800">{m.label}</div>
                      <div className="text-sm text-gray-500">{m.desc}</div>
                    </div>
                  </label>
                ))}
              </div>
              <div className="flex gap-3 mt-6">
                <button onClick={() => setStep(0)} className="btn-secondary">← Back</button>
                <button onClick={() => setStep(2)} className="btn-primary">Review Order →</button>
              </div>
            </div>
          )}

          {/* Step 2: Review */}
          {step === 2 && (
            <div className="card p-6">
              <h2 className="font-bold text-gray-800 mb-5">Review Your Order</h2>
              <div className="space-y-3">
                {items.map(item => (
                  <div key={item.id} className="flex items-center gap-3 py-3 border-b border-gray-100 last:border-0">
                    <img src={item.thumbnail} alt={item.name} className="w-16 h-16 object-cover rounded-xl bg-gray-50" />
                    <div className="flex-1">
                      <div className="font-medium text-gray-800 text-sm line-clamp-1">{item.name}</div>
                      <div className="text-xs text-gray-400 mt-0.5">Qty: {item.qty}</div>
                    </div>
                    <div className="font-semibold text-blue-600">{formatPrice((item.sale_price || item.price) * item.qty)}</div>
                  </div>
                ))}
              </div>
              <div className="mt-4 p-4 bg-gray-50 rounded-xl text-sm space-y-1">
                <div className="font-medium text-gray-700">Delivering to:</div>
                <div className="text-gray-600">{form.shipping_name} • {form.shipping_phone}</div>
                <div className="text-gray-600">{form.shipping_address}, {form.shipping_city}</div>
              </div>
              <div className="flex gap-3 mt-6">
                <button onClick={() => setStep(1)} className="btn-secondary">← Back</button>
                <button onClick={handlePlaceOrder} disabled={loading} className="btn-primary flex-1 justify-center">
                  {loading ? 'Placing Order...' : `Place Order • ${formatPrice(total)}`}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Summary sidebar */}
        <div className="card p-5 h-fit sticky top-24">
          <h3 className="font-semibold text-gray-800 mb-4">Order Summary</h3>
          <div className="space-y-2 text-sm text-gray-600 mb-4">
            {items.map(i => (
              <div key={i.id} className="flex justify-between gap-2">
                <span className="line-clamp-1">{i.name} × {i.qty}</span>
                <span className="shrink-0 font-medium">{formatPrice((i.sale_price || i.price) * i.qty)}</span>
              </div>
            ))}
          </div>
          <div className="border-t border-gray-100 pt-3 space-y-2 text-sm">
            <div className="flex justify-between text-gray-600"><span>Subtotal</span><span>{formatPrice(subtotal)}</span></div>
            {discount > 0 && <div className="flex justify-between text-green-600 font-medium"><span>Discount</span><span>-{formatPrice(discount)}</span></div>}
            <div className="flex justify-between text-gray-600"><span>Shipping</span><span>{shipping === 0 ? 'FREE' : formatPrice(shipping)}</span></div>
            <div className="flex justify-between font-bold text-lg border-t pt-2"><span>Total</span><span className="text-blue-600">{formatPrice(total)}</span></div>
          </div>
        </div>
      </div>
    </div>
  );
}
