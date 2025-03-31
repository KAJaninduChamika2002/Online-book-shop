import { useEffect, useState } from 'react';
import { Shield } from 'lucide-react';
import api from '../../utils/api';
import toast from 'react-hot-toast';

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({});

  const fetchUsers = async () => {
    setLoading(true);
    const { data } = await api.get(`/admin/users?page=${page}`);
    setUsers(data.users);
    setPagination(data.pagination);
    setLoading(false);
  };

  useEffect(() => { fetchUsers(); }, [page]);

  const toggleRole = async (id, currentRole) => {
    const newRole = currentRole === 'admin' ? 'user' : 'admin';
    if (!confirm(`Make this user ${newRole}?`)) return;
    await api.put(`/admin/users/${id}/role`, { role: newRole });
    toast.success('User role updated');
    fetchUsers();
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Users ({pagination.total})</h1>
      <div className="card overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              {['User','Email','Phone','Role','Joined','Action'].map(h => (
                <th key={h} className="text-left px-5 py-3 font-semibold text-gray-600">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {loading ? (
              <tr><td colSpan={6} className="text-center py-10 text-gray-400">Loading...</td></tr>
            ) : users.map(u => (
              <tr key={u.id} className="hover:bg-gray-50">
                <td className="px-5 py-3">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 bg-blue-100 rounded-full flex items-center justify-center font-bold text-blue-600 text-sm">
                      {u.name?.charAt(0)}
                    </div>
                    <span className="font-medium text-gray-800">{u.name}</span>
                  </div>
                </td>
                <td className="px-5 py-3 text-gray-500">{u.email}</td>
                <td className="px-5 py-3 text-gray-500">{u.phone || '-'}</td>
                <td className="px-5 py-3">
                  <span className={`badge capitalize ${u.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-600'}`}>
                    {u.role}
                  </span>
                </td>
                <td className="px-5 py-3 text-gray-400 text-xs">
                  {new Date(u.created_at).toLocaleDateString()}
                </td>
                <td className="px-5 py-3">
                  <button onClick={() => toggleRole(u.id, u.role)} className="flex items-center gap-1.5 text-xs text-purple-600 hover:bg-purple-50 px-3 py-1.5 rounded-lg transition-colors">
                    <Shield size={13} />
                    {u.role === 'admin' ? 'Remove Admin' : 'Make Admin'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {pagination.pages > 1 && (
          <div className="flex justify-center gap-2 p-4 border-t border-gray-100">
            {Array.from({ length: pagination.pages }, (_, i) => i + 1).map(p => (
              <button key={p} onClick={() => setPage(p)} className={`w-9 h-9 rounded-lg text-sm font-medium ${p === page ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'}`}>{p}</button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
