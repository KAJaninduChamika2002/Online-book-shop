import { useEffect, useState } from 'react';
import { Plus, Edit, Trash2 } from 'lucide-react';
import api from '../../utils/api';
import toast from 'react-hot-toast';

export default function AdminCategories() {
  const [categories, setCategories] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ name: '', description: '', image: '', sort_order: 0 });

  const fetch = () => api.get('/categories').then(({ data }) => setCategories(data.categories));
  useEffect(() => { fetch(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editing) {
        await api.put(`/categories/${editing.id}`, { ...form, is_active: 1 });
        toast.success('Category updated!');
      } else {
        await api.post('/categories', form);
        toast.success('Category created!');
      }
      setShowForm(false); setEditing(null); setForm({ name: '', description: '', image: '', sort_order: 0 });
      fetch();
    } catch (err) { toast.error(err.response?.data?.message || 'Failed'); }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this category?')) return;
    await api.delete(`/categories/${id}`);
    toast.success('Deleted');
    fetch();
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Categories</h1>
        <button onClick={() => { setShowForm(true); setEditing(null); setForm({ name: '', description: '', image: '', sort_order: 0 }); }} className="btn-primary">
          <Plus size={16} /> Add Category
        </button>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {categories.map(cat => (
          <div key={cat.id} className="card p-4 flex items-center gap-3">
            <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-2xl shrink-0">
              {cat.image ? <img src={cat.image} alt={cat.name} className="w-full h-full rounded-xl object-cover" /> : '📦'}
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-semibold text-gray-800">{cat.name}</div>
              <div className="text-xs text-gray-400">{cat.product_count} products</div>
            </div>
            <div className="flex gap-1 shrink-0">
              <button onClick={() => { setEditing(cat); setForm({ name: cat.name, description: cat.description || '', image: cat.image || '', sort_order: cat.sort_order }); setShowForm(true); }} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg">
                <Edit size={14} />
              </button>
              <button onClick={() => handleDelete(cat.id)} className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg">
                <Trash2 size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-2xl w-full max-w-md mx-4 shadow-2xl">
            <div className="flex justify-between items-center p-5 border-b border-gray-100">
              <h2 className="font-bold text-gray-800">{editing ? 'Edit' : 'Add'} Category</h2>
              <button onClick={() => setShowForm(false)}>✕</button>
            </div>
            <form onSubmit={handleSubmit} className="p-5 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Name *</label>
                <input required value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} className="input-field" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Description</label>
                <textarea rows={2} value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} className="input-field resize-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Image URL</label>
                <input value={form.image} onChange={e => setForm(f => ({ ...f, image: e.target.value }))} className="input-field" placeholder="https://..." />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Sort Order</label>
                <input type="number" value={form.sort_order} onChange={e => setForm(f => ({ ...f, sort_order: e.target.value }))} className="input-field" />
              </div>
              <div className="flex gap-3">
                <button type="button" onClick={() => setShowForm(false)} className="btn-secondary">Cancel</button>
                <button type="submit" className="btn-primary">{editing ? 'Update' : 'Create'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
