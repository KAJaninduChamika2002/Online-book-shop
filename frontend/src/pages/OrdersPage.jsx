import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Package, ChevronRight } from 'lucide-react';
import api from '../utils/api';
import { formatPrice } from '../utils/helpers';

const STATUS_COLORS = {
  pending: 'bg-yellow-100 text-yellow-700',
  processing: 'bg-blue-100 text-blue-700',
  shipped: 'bg-purple-100 text-purple-700',
  delivered: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700',
};

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/orders/my-orders').then(({ data }) => setOrders(data.orders)).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="container-custom py-10 text-center text-gray-400">Loading orders...</div>;

  return (
    <div className="container-custom py-10 max-w-3xl">
      <h1 className="text-2xl font-bold text-gray-800 mb-8">My Orders</h1>

      {orders.length === 0 ? (
        <div className="text-center py-16">
          <Package size={48} className="mx-auto text-gray-300 mb-4" />
          <p className="text-gray-500">No orders yet.</p>
          <Link to="/shop" className="btn-primary mt-4 inline-flex">Start Shopping</Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map(order => (
            <Link key={order.id} to={`/orders/${order.id}`} className="card p-5 block hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="font-bold text-blue-600">#{order.order_number}</div>
                  <div className="text-sm text-gray-500 mt-0.5 line-clamp-1">{order.items_summary}</div>
                  <div className="text-xs text-gray-400 mt-1">{new Date(order.created_at).toLocaleDateString('en-LK', { dateStyle: 'medium' })}</div>
                </div>
                <div className="text-right shrink-0">
                  <div className="font-bold text-gray-800">{formatPrice(order.total)}</div>
                  <span className={`badge mt-1 capitalize ${STATUS_COLORS[order.status] || 'bg-gray-100 text-gray-600'}`}>
                    {order.status}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
