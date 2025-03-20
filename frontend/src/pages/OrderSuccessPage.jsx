import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { CheckCircle, Package, Truck, Home } from 'lucide-react';
import api from '../utils/api';
import { formatPrice } from '../utils/helpers';

export default function OrderSuccessPage() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);

  useEffect(() => {
    api.get(`/orders/${id}`).then(({ data }) => setOrder(data.order)).catch(() => {});
  }, [id]);

  return (
    <div className="container-custom py-16 max-w-2xl text-center">
      <div className="card p-10">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle size={40} className="text-green-500" />
        </div>
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Order Placed! 🎉</h1>
        <p className="text-gray-500 mb-6">Thank you! Your order has been received and is being processed.</p>

        {order && (
          <div className="bg-gray-50 rounded-2xl p-5 text-left mb-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <div className="text-sm text-gray-500">Order Number</div>
                <div className="font-bold text-blue-600 text-lg">#{order.order_number}</div>
              </div>
              <div className="text-right">
                <div className="text-sm text-gray-500">Total</div>
                <div className="font-bold text-xl text-gray-800">{formatPrice(order.total)}</div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <div className="text-gray-400">Payment</div>
                <div className="font-medium capitalize">{order.payment_method?.replace('_', ' ')}</div>
              </div>
              <div>
                <div className="text-gray-400">Status</div>
                <div className="font-medium text-orange-500 capitalize">{order.status}</div>
              </div>
              <div className="col-span-2">
                <div className="text-gray-400">Delivering to</div>
                <div className="font-medium">{order.shipping_name} • {order.shipping_city}</div>
              </div>
            </div>
          </div>
        )}

        {/* Progress */}
        <div className="flex items-center justify-center gap-2 mb-8">
          {[
            [CheckCircle, 'Confirmed', true],
            [Package, 'Processing', false],
            [Truck, 'Shipped', false],
            [Home, 'Delivered', false],
          ].map(([Icon, label, active], i) => (
            <div key={label} className="flex items-center gap-1">
              <div className={`flex flex-col items-center ${active ? 'text-green-500' : 'text-gray-300'}`}>
                <Icon size={24} />
                <span className="text-xs mt-1 font-medium">{label}</span>
              </div>
              {i < 3 && <div className="w-8 h-0.5 bg-gray-200 mx-1 -translate-y-2" />}
            </div>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link to="/orders" className="btn-primary">View My Orders</Link>
          <Link to="/shop" className="btn-secondary">Continue Shopping</Link>
        </div>
      </div>
    </div>
  );
}
