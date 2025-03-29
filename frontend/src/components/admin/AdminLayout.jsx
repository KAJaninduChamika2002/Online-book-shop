import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Package, ShoppingBag, Tag, Users, LogOut, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';

const NAV = [
  [LayoutDashboard, 'Dashboard', '/admin'],
  [Package, 'Products', '/admin/products'],
  [ShoppingBag, 'Orders', '/admin/orders'],
  [Tag, 'Categories', '/admin/categories'],
  [Users, 'Users', '/admin/users'],
];

export default function AdminLayout() {
  const [open, setOpen] = useState(true);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className={`${open ? 'w-60' : 'w-16'} bg-gray-900 text-white flex flex-col transition-all duration-300 shrink-0`}>
        <div className="flex items-center gap-3 px-4 py-5 border-b border-gray-700">
          {open && <><span className="text-xl">🧸</span><span className="font-bold">ToyShop Admin</span></>}
          <button onClick={() => setOpen(!open)} className="ml-auto text-gray-400 hover:text-white">
            {open ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>

        <nav className="flex-1 py-4 space-y-1 px-2">
          {NAV.map(([Icon, label, path]) => (
            <NavLink
              key={path}
              to={path}
              end={path === '/admin'}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors text-sm font-medium ${isActive ? 'bg-blue-600 text-white' : 'text-gray-400 hover:bg-gray-800 hover:text-white'}`
              }
            >
              <Icon size={18} />
              {open && label}
            </NavLink>
          ))}
        </nav>

        <div className="border-t border-gray-700 p-3">
          {open && <div className="text-xs text-gray-400 mb-2 px-2">{user?.name}</div>}
          <button
            onClick={() => { logout(); navigate('/'); }}
            className="flex items-center gap-3 w-full px-3 py-2 text-gray-400 hover:text-red-400 hover:bg-gray-800 rounded-xl transition-colors text-sm"
          >
            <LogOut size={18} /> {open && 'Logout'}
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between">
          <h1 className="text-lg font-semibold text-gray-700">Admin Panel</h1>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <div className="w-7 h-7 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-xs">
              {user?.name?.charAt(0)}
            </div>
            {user?.name}
          </div>
        </header>
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
