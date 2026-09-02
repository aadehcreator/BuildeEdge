'use client';
import { useEffect, useState } from 'react';
import { useAuthStore } from '@/store/authStore';
import Image from 'next/image';
import { Plus, Loader2, ChevronRight } from 'lucide-react';
import toast from 'react-hot-toast';

interface Category {
  id: string; name: string; slug: string; image: string;
  isActive: boolean; sortOrder: number; parentId: string | null;
  children: Category[];
  _count: { products: number };
}

export default function AdminCategoriesPage() {
  const { accessToken } = useAuthStore();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ name: '', slug: '', image: '', parentId: '', sortOrder: 0 });

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/categories', { headers: { Authorization: `Bearer ${accessToken}` } });
      const data = await res.json() as { categories: Category[] };
      setCategories(data.categories ?? []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchCategories(); }, [accessToken]);

  const handleSave = async () => {
    if (!form.name || !form.slug || !form.image) { toast.error('Fill all required fields'); return; }
    setSaving(true);
    try {
      const body = { ...form, parentId: form.parentId || undefined, sortOrder: Number(form.sortOrder) };
      const res = await fetch('/api/admin/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${accessToken}` },
        body: JSON.stringify(body),
      });
      if (!res.ok) { const d = await res.json() as { error?: string }; throw new Error(d.error ?? 'Failed'); }
      toast.success('Category created!');
      setShowForm(false);
      setForm({ name: '', slug: '', image: '', parentId: '', sortOrder: 0 });
      fetchCategories();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Failed to create category');
    } finally {
      setSaving(false);
    }
  };

  const genSlug = (name: string) => name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="font-heading font-bold text-2xl text-white">Categories</h1>
        <button
          onClick={() => setShowForm((v) => !v)}
          className="flex items-center gap-1.5 px-3 py-2 bg-primary text-white text-sm font-semibold rounded-xl hover:bg-primary-dark transition-colors"
        >
          <Plus size={14} /> Add Category
        </button>
      </div>

      {/* Add form */}
      {showForm && (
        <div className="bg-gray-900 rounded-xl border border-gray-700 p-4 space-y-3">
          <h2 className="text-white font-semibold text-sm">New Category</h2>
          <div className="grid grid-cols-2 gap-3">
            <input value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value, slug: genSlug(e.target.value) }))}
              placeholder="Category name *"
              className="px-3 py-2 text-sm bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-primary"
            />
            <input value={form.slug} onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))}
              placeholder="slug (auto-generated)"
              className="px-3 py-2 text-sm bg-gray-800 border border-gray-700 rounded-lg text-gray-400 font-mono focus:outline-none focus:border-primary"
            />
          </div>
          <input value={form.image} onChange={(e) => setForm((f) => ({ ...f, image: e.target.value }))}
            placeholder="Image URL *"
            className="w-full px-3 py-2 text-sm bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-primary"
          />
          <div className="grid grid-cols-2 gap-3">
            <select value={form.parentId} onChange={(e) => setForm((f) => ({ ...f, parentId: e.target.value }))}
              className="px-3 py-2 text-sm bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-primary"
            >
              <option value="">No parent (root category)</option>
              {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
            <input type="number" value={form.sortOrder} onChange={(e) => setForm((f) => ({ ...f, sortOrder: Number(e.target.value) }))}
              placeholder="Sort order"
              className="px-3 py-2 text-sm bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-primary"
            />
          </div>
          <div className="flex gap-2">
            <button onClick={handleSave} disabled={saving}
              className="px-4 py-2 bg-primary text-white text-sm font-semibold rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-60 flex items-center gap-2"
            >
              {saving ? <Loader2 size={14} className="animate-spin" /> : null} Save
            </button>
            <button onClick={() => setShowForm(false)} className="px-4 py-2 bg-gray-700 text-gray-300 text-sm rounded-lg hover:bg-gray-600 transition-colors">Cancel</button>
          </div>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-12"><Loader2 size={28} className="animate-spin text-primary" /></div>
      ) : (
        <div className="bg-gray-900 rounded-xl border border-gray-800 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-gray-500 text-xs border-b border-gray-800">
                <th className="text-left px-4 py-3 font-medium">Category</th>
                <th className="text-left px-4 py-3 font-medium">Slug</th>
                <th className="text-center px-4 py-3 font-medium">Products</th>
                <th className="text-center px-4 py-3 font-medium">Sub-cats</th>
                <th className="text-center px-4 py-3 font-medium">Order</th>
                <th className="text-center px-4 py-3 font-medium">Active</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((cat) => (
                <>
                  <tr key={cat.id} className="border-t border-gray-800 hover:bg-gray-800/30">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg overflow-hidden bg-gray-700 flex-shrink-0">
                          <Image src={cat.image} alt={cat.name} width={32} height={32} className="w-full h-full object-cover" />
                        </div>
                        <span className="text-gray-200 font-medium text-sm">{cat.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-500 font-mono text-xs">{cat.slug}</td>
                    <td className="px-4 py-3 text-center text-gray-300">{cat._count.products}</td>
                    <td className="px-4 py-3 text-center text-gray-400">{cat.children.length}</td>
                    <td className="px-4 py-3 text-center text-gray-400">{cat.sortOrder}</td>
                    <td className="px-4 py-3 text-center">
                      <span className={`text-xs font-semibold ${cat.isActive ? 'text-green-400' : 'text-red-400'}`}>
                        {cat.isActive ? 'Active' : 'Hidden'}
                      </span>
                    </td>
                  </tr>
                  {cat.children.map((sub) => (
                    <tr key={sub.id} className="border-t border-gray-800/50 hover:bg-gray-800/20">
                      <td className="px-4 py-2 pl-12">
                        <div className="flex items-center gap-2">
                          <ChevronRight size={12} className="text-gray-600" />
                          <span className="text-gray-400 text-xs">{sub.name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-2 text-gray-600 font-mono text-[10px]">{sub.slug}</td>
                      <td className="px-4 py-2 text-center text-gray-500 text-xs">{sub._count?.products ?? 0}</td>
                      <td className="px-4 py-2 text-center text-gray-600 text-xs">—</td>
                      <td className="px-4 py-2 text-center text-gray-500 text-xs">{sub.sortOrder}</td>
                      <td className="px-4 py-2 text-center">
                        <span className={`text-[10px] font-medium ${sub.isActive ? 'text-green-500' : 'text-red-500'}`}>
                          {sub.isActive ? '✓' : '✗'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
