import { useEffect, useState } from 'react';
import { ShoppingBag, Users, Package, DollarSign, TrendingUp, AlertTriangle } from 'lucide-react';
import api from '../../utils/api';
import { formatPrice } from '../../utils/helpers';

const STATUS_COLORS = {
  pending: 'bg-yellow-100 text-yellow-700',
  processing: 'bg-blue-100 text-blue-700',
  shipped: 'bg-purple-100 text-purple-700',
  delivered: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700',
};

export default function AdminDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/admin/dashboard').then(({ data }) => setData(data)).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="text-gray-400">Loading dashboard...</div>;

  const { stats, recent_orders, top_products } = data;

  const CARDS = [
    { label: 'Total Orders', value: stats.total_orders, icon: ShoppingBag, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Revenue (Paid)', value: formatPrice(stats.total_revenue), icon: DollarSign, color: 'text-green-600', bg: 'bg-green-50' },
    { label: 'Total Users', value: stats.total_users, icon: Users, color: 'text-purple-600', bg: 'bg-purple-50' },
    { label: 'Active Products', value: stats.total_products, icon: Package, color: 'text-orange-600', bg: 'bg-orange-50' },
    { label: 'Pending Orders', value: stats.pending_orders, icon: TrendingUp, color: 'text-yellow-600', bg: 'bg-yellow-50' },
    { label: 'Low Stock Items', value: stats.low_stock, icon: AlertTriangle, color: 'text-red-600', bg: 'bg-red-50' },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Dashboard Overview</h1>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {CARDS.map(c => (
          <div key={c.label} className="card p-4">
            <div className={`w-10 h-10 ${c.bg} rounded-xl flex items-center justify-center mb-3`}>
              <c.icon size={20} className={c.color} />
            </div>
            <div className="text-2xl font-bold text-gray-800">{c.value}</div>
            <div className="text-xs text-gray-500 mt-0.5">{c.label}</div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent orders */}
        <div className="card p-5">
          <h2 className="font-bold text-gray-800 mb-4">Recent Orders</h2>
          <div className="space-y-3">
            {recent_orders.map(o => (
              <div key={o.id} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                <div>
                  <div className="font-medium text-sm text-blue-600">#{o.order_number}</div>
                  <div className="text-xs text-gray-400">{o.user_name || 'Guest'}</div>
                </div>
                <div className="text-right">
                  <div className="font-semibold text-sm">{formatPrice(o.total)}</div>
                  <span className={`badge text-xs capitalize ${STATUS_COLORS[o.status] || 'bg-gray-100 text-gray-600'}`}>{o.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top products */}
        <div className="card p-5">
          <h2 className="font-bold text-gray-800 mb-4">Top Selling Products</h2>
          <div className="space-y-3">
            {top_products.map((p, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-7 h-7 rounded-full bg-blue-100 text-blue-600 font-bold text-xs flex items-center justify-center shrink-0">
                  {i + 1}
                </div>
                <img src={p.thumbnail} alt={p.name} className="w-10 h-10 rounded-lg object-cover bg-gray-50" />
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-gray-800 line-clamp-1">{p.name}</div>
                  <div className="text-xs text-gray-400">{p.sold} sold</div>
                </div>
                <div className="text-sm font-bold text-green-600">{formatPrice(p.revenue)}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
