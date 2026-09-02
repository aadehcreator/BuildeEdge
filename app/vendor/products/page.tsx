'use client';
import { useEffect, useState, useCallback } from 'react';
import { useAuthStore } from '@/store/authStore';
import Image from 'next/image';
import { Plus, Loader2, ToggleLeft, ToggleRight, Trash2, PackagePlus } from 'lucide-react';
import toast from 'react-hot-toast';

interface Product {
  id: string; name: string; sku: string; images: string[];
  mrp: number; sellingPrice: number; unit: string; stock: number;
  isActive: boolean; isFeatured: boolean;
  category: { name: string }; brand: { name: string } | null;
}

interface Category { id: string; name: string; slug: string; }
interface Brand { id: string; name: string; }

const EMPTY_FORM = {
  name: '', description: '', categoryId: '', brandId: '',
  images: [''], mrp: '', sellingPrice: '', unit: '', sku: '',
  stock: '', reorderPoint: '10', lowStockThreshold: '5',
  tags: '', cashbackPercent: '1',
};

export default function VendorProductsPage() {
  const { accessToken } = useAuthStore();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [notApproved, setNotApproved] = useState(false);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/vendor/products', {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      if (res.status === 403) { setNotApproved(true); return; }
      const data = await res.json() as { products: Product[] };
      setProducts(data.products ?? []);
    } finally { setLoading(false); }
  }, [accessToken]);

  useEffect(() => {
    fetchProducts();
    // Load categories and brands for the form
    Promise.all([
      fetch('/api/categories').then((r) => r.json() as Promise<{ categories: Category[] }>),
    ]).then(([catData]) => {
      const flat: Category[] = [];
      catData.categories?.forEach((c) => {
        flat.push(c);
        (c as Category & { children?: Category[] }).children?.forEach((ch) => flat.push(ch));
      });
      setCategories(flat);
    }).catch(() => {});
  }, [fetchProducts]);

  const f = (key: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm((p) => ({ ...p, [key]: e.target.value }));

  const handleSave = async () => {
    if (!form.name || !form.categoryId || !form.mrp || !form.sellingPrice || !form.unit || !form.sku) {
      toast.error('Fill all required fields'); return;
    }
    setSaving(true);
    try {
      const body = {
        name: form.name,
        description: form.description,
        categoryId: form.categoryId,
        brandId: form.brandId || undefined,
        images: form.images.filter(Boolean),
        mrp: Number(form.mrp),
        sellingPrice: Number(form.sellingPrice),
        unit: form.unit,
        sku: form.sku,
        stock: Number(form.stock) || 0,
        reorderPoint: Number(form.reorderPoint) || 10,
        lowStockThreshold: Number(form.lowStockThreshold) || 5,
        tags: form.tags ? form.tags.split(',').map((t) => t.trim()) : [],
        cashbackPercent: Number(form.cashbackPercent) || 1,
      };
      const res = await fetch('/api/vendor/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${accessToken}` },
        body: JSON.stringify(body),
      });
      const data = await res.json() as { error?: string };
      if (!res.ok) throw new Error(data.error ?? 'Failed');
      toast.success('Product submitted! Admin will review and activate it.');
      setShowForm(false);
      setForm(EMPTY_FORM);
      fetchProducts();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Failed');
    } finally { setSaving(false); }
  };

  const toggleActive = async (id: string, current: boolean) => {
    try {
      await fetch(`/api/vendor/products/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${accessToken}` },
        body: JSON.stringify({ isActive: !current }),
      });
      setProducts((p) => p.map((pr) => pr.id === id ? { ...pr, isActive: !current } : pr));
      toast.success(!current ? 'Product activated' : 'Product deactivated');
    } catch { toast.error('Failed'); }
  };

  const deleteProduct = async (id: string, name: string) => {
    if (!confirm(`Remove "${name}"?`)) return;
    try {
      await fetch(`/api/vendor/products/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      setProducts((p) => p.filter((pr) => pr.id !== id));
      toast.success('Product removed');
    } catch { toast.error('Failed'); }
  };

  const inp = 'w-full px-3 py-2 text-sm bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-primary placeholder-gray-600';
  const lbl = 'block text-xs text-gray-400 mb-1 font-medium';

  if (notApproved) {
    return (
      <div className="text-center py-16">
        <div className="text-5xl mb-4">⏳</div>
        <h2 className="font-heading font-bold text-xl text-white mb-2">Account Not Approved Yet</h2>
        <p className="text-gray-400 text-sm">Your vendor account is under review. You can add products once approved.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading font-bold text-2xl text-white">My Products</h1>
          <p className="text-gray-500 text-xs mt-0.5">New products go to admin for review before going live</p>
        </div>
        <button onClick={() => setShowForm((v) => !v)}
          className="flex items-center gap-1.5 px-3 py-2 bg-primary text-white text-sm font-semibold rounded-xl hover:bg-primary-dark transition-colors">
          <Plus size={14} /> Add Product
        </button>
      </div>

      {/* Add Product Form */}
      {showForm && (
        <div className="bg-gray-900 rounded-xl border border-gray-700 p-5 space-y-4">
          <div className="flex items-center gap-2 mb-1">
            <PackagePlus size={18} className="text-primary" />
            <h2 className="text-white font-semibold">New Product</h2>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="col-span-2">
              <label className={lbl}>Product Name *</label>
              <input value={form.name} onChange={f('name')} placeholder="e.g. UltraTech Cement OPC 53 Grade" className={inp} />
            </div>
            <div>
              <label className={lbl}>Category *</label>
              <select value={form.categoryId} onChange={f('categoryId')} className={inp}>
                <option value="">Select category</option>
                {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div>
              <label className={lbl}>SKU *</label>
              <input value={form.sku} onChange={f('sku')} placeholder="Unique product code" className={inp} />
            </div>
            <div>
              <label className={lbl}>MRP (₹) *</label>
              <input type="number" value={form.mrp} onChange={f('mrp')} placeholder="395" className={inp} />
            </div>
            <div>
              <label className={lbl}>Selling Price (₹) *</label>
              <input type="number" value={form.sellingPrice} onChange={f('sellingPrice')} placeholder="365" className={inp} />
            </div>
            <div>
              <label className={lbl}>Unit *</label>
              <input value={form.unit} onChange={f('unit')} placeholder="50 Kg Bag / Litre / Piece" className={inp} />
            </div>
            <div>
              <label className={lbl}>Opening Stock</label>
              <input type="number" value={form.stock} onChange={f('stock')} placeholder="0" className={inp} />
            </div>
            <div>
              <label className={lbl}>Reorder Point</label>
              <input type="number" value={form.reorderPoint} onChange={f('reorderPoint')} placeholder="10" className={inp} />
            </div>
            <div>
              <label className={lbl}>Low Stock Alert At</label>
              <input type="number" value={form.lowStockThreshold} onChange={f('lowStockThreshold')} placeholder="5" className={inp} />
            </div>
            <div className="col-span-2">
              <label className={lbl}>Image URL</label>
              <input value={form.images[0]} onChange={(e) => setForm((p) => ({ ...p, images: [e.target.value] }))}
                placeholder="https://..." className={inp} />
            </div>
            <div className="col-span-2">
              <label className={lbl}>Description</label>
              <textarea value={form.description} onChange={f('description')} rows={2}
                placeholder="Product description..." className={`${inp} resize-none`} />
            </div>
            <div className="col-span-2">
              <label className={lbl}>Tags (comma separated)</label>
              <input value={form.tags} onChange={f('tags')} placeholder="cement, opc, construction" className={inp} />
            </div>
          </div>

          <div className="flex gap-2 pt-2">
            <button onClick={handleSave} disabled={saving}
              className="px-5 py-2.5 bg-primary text-white text-sm font-bold rounded-xl hover:bg-primary-dark transition-colors disabled:opacity-60 flex items-center gap-2">
              {saving ? <Loader2 size={14} className="animate-spin" /> : null}
              Submit for Review
            </button>
            <button onClick={() => setShowForm(false)}
              className="px-5 py-2.5 bg-gray-700 text-gray-300 text-sm rounded-xl hover:bg-gray-600 transition-colors">
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Products Table */}
      {loading ? (
        <div className="flex justify-center py-12"><Loader2 size={28} className="animate-spin text-primary" /></div>
      ) : products.length === 0 ? (
        <div className="bg-gray-900 rounded-xl border border-gray-800 p-12 text-center">
          <PackagePlus size={40} className="text-gray-600 mx-auto mb-3" />
          <p className="text-gray-400 font-medium">No products yet</p>
          <p className="text-gray-600 text-sm mt-1">Add your first product above</p>
        </div>
      ) : (
        <div className="bg-gray-900 rounded-xl border border-gray-800 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-gray-500 text-xs border-b border-gray-800">
                  <th className="text-left px-4 py-3 font-medium">Product</th>
                  <th className="text-left px-4 py-3 font-medium">Category</th>
                  <th className="text-right px-4 py-3 font-medium">Price</th>
                  <th className="text-center px-4 py-3 font-medium">Stock</th>
                  <th className="text-center px-4 py-3 font-medium">Status</th>
                  <th className="text-center px-4 py-3 font-medium">Active</th>
                  <th className="text-left px-4 py-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((p) => (
                  <tr key={p.id} className="border-t border-gray-800 hover:bg-gray-800/30 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-gray-700 overflow-hidden flex-shrink-0">
                          <Image src={p.images[0] ?? 'https://placehold.co/40x40?text=?'} alt={p.name} width={40} height={40} className="w-full h-full object-contain p-1" />
                        </div>
                        <div>
                          <p className="text-gray-200 font-medium text-xs line-clamp-1 max-w-[160px]">{p.name}</p>
                          <p className="text-gray-500 text-[10px]">SKU: {p.sku}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-400 text-xs">{p.category.name}</td>
                    <td className="px-4 py-3 text-white font-semibold text-right text-sm">₹{p.sellingPrice}</td>
                    <td className="px-4 py-3 text-center">
                      <span className={`text-xs font-bold ${p.stock === 0 ? 'text-red-400' : p.stock <= 5 ? 'text-orange-400' : 'text-green-400'}`}>
                        {p.stock} {p.unit}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${p.isActive ? 'bg-green-900/50 text-green-300' : 'bg-yellow-900/50 text-yellow-300'}`}>
                        {p.isActive ? 'Live' : 'Pending Review'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <button onClick={() => toggleActive(p.id, p.isActive)}>
                        {p.isActive ? <ToggleRight size={20} className="text-green-400" /> : <ToggleLeft size={20} className="text-gray-600" />}
                      </button>
                    </td>
                    <td className="px-4 py-3">
                      <button onClick={() => deleteProduct(p.id, p.name)}
                        className="p-1.5 rounded-lg bg-red-900/50 text-red-400 hover:bg-red-900 transition-colors">
                        <Trash2 size={12} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
