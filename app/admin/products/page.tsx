'use client';
import { useEffect, useState, useCallback } from 'react';
import { useAuthStore } from '@/store/authStore';
import Image from 'next/image';
import { DEFAULT_PRODUCT_IMAGE } from '@/lib/constants';
import { Search, Plus, Loader2, Pencil, Trash2, ToggleLeft, ToggleRight } from 'lucide-react';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

interface Product {
  id: string; name: string; slug: string; sku: string; images: string[];
  mrp: number; sellingPrice: number; unit: string; stock: number;
  isActive: boolean; isFeatured: boolean; isNewLaunch: boolean;
  category: { name: string }; brand: { name: string } | null;
}

interface Pagination { page: number; limit: number; total: number; pages: number; }

export default function AdminProductsPage() {
  const { accessToken } = useAuthStore();
  const [products, setProducts] = useState<Product[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [page, setPage] = useState(1);
  const [updating, setUpdating] = useState<string | null>(null);

  // Edit modal state
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [editName, setEditName] = useState('');
  const [editSellingPrice, setEditSellingPrice] = useState('');
  const [editMrp, setEditMrp] = useState('');
  const [editStock, setEditStock] = useState('');
  const [editImage, setEditImage] = useState('');
  const [saving, setSaving] = useState(false);

  const openEditModal = (product: Product) => {
    setEditingProduct(product);
    setEditName(product.name);
    setEditSellingPrice(String(product.sellingPrice));
    setEditMrp(String(product.mrp));
    setEditStock(String(product.stock));
    setEditImage(product.images[0] || '');
  };

  const handleSaveEdit = async () => {
    if (!editingProduct) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/products/${editingProduct.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${accessToken}` },
        body: JSON.stringify({
          name: editName,
          sellingPrice: parseFloat(editSellingPrice) || 0,
          mrp: parseFloat(editMrp) || 0,
          stock: parseInt(editStock, 10) || 0,
          images: editImage ? [editImage] : editingProduct.images,
        }),
      });
      if (!res.ok) throw new Error('Failed to update product');

      setProducts((prev) => prev.map((p) => p.id === editingProduct.id ? {
        ...p,
        name: editName,
        sellingPrice: parseFloat(editSellingPrice) || p.sellingPrice,
        mrp: parseFloat(editMrp) || p.mrp,
        stock: parseInt(editStock, 10) || p.stock,
        images: editImage ? [editImage] : p.images,
      } : p));

      toast.success('Product updated successfully');
      setEditingProduct(null);
    } catch (err: any) {
      toast.error(err?.message || 'Failed to update');
    } finally {
      setSaving(false);
    }
  };

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: String(page), limit: '20' });
      if (search) params.set('search', search);
      const res = await fetch(`/api/admin/products?${params}`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      const data = await res.json() as { products: Product[]; pagination: Pagination };
      setProducts(data.products ?? []);
      setPagination(data.pagination);
    } finally {
      setLoading(false);
    }
  }, [accessToken, search, page]);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  const toggleActive = async (id: string, current: boolean) => {
    setUpdating(id);
    try {
      const res = await fetch(`/api/admin/products/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${accessToken}` },
        body: JSON.stringify({ isActive: !current }),
      });
      if (!res.ok) throw new Error('Failed');
      setProducts((prev) => prev.map((p) => p.id === id ? { ...p, isActive: !current } : p));
      toast.success(`Product ${!current ? 'activated' : 'deactivated'}`);
    } catch {
      toast.error('Failed to update');
    } finally {
      setUpdating(null);
    }
  };

  const toggleFeatured = async (id: string, current: boolean) => {
    setUpdating(id);
    try {
      await fetch(`/api/admin/products/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${accessToken}` },
        body: JSON.stringify({ isFeatured: !current }),
      });
      setProducts((prev) => prev.map((p) => p.id === id ? { ...p, isFeatured: !current } : p));
      toast.success(!current ? 'Marked as featured' : 'Removed from featured');
    } catch {
      toast.error('Failed');
    } finally {
      setUpdating(null);
    }
  };

  const deleteProduct = async (id: string, name: string) => {
    if (!confirm(`Delete "${name}"? This will deactivate the product.`)) return;
    try {
      await fetch(`/api/admin/products/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      setProducts((prev) => prev.filter((p) => p.id !== id));
      toast.success('Product deleted');
    } catch {
      toast.error('Failed to delete');
    }
  };

  const handleSearch = () => { setSearch(searchInput); setPage(1); };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="font-heading font-bold text-2xl text-white">Products</h1>
        <button className="flex items-center gap-1.5 px-3 py-2 bg-primary text-white text-sm font-semibold rounded-xl hover:bg-primary-dark transition-colors">
          <Plus size={14} /> Add Product
        </button>
      </div>

      {/* Search */}
      <div className="flex gap-2">
        <div className="flex-1 flex items-center gap-2 bg-gray-800 border border-gray-700 rounded-xl px-3 py-2">
          <Search size={14} className="text-gray-500" />
          <input
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            placeholder="Search products..."
            className="flex-1 bg-transparent text-gray-200 text-sm focus:outline-none placeholder-gray-600"
          />
        </div>
        <button onClick={handleSearch} className="px-4 py-2 bg-gray-700 text-gray-200 text-sm rounded-xl hover:bg-gray-600 transition-colors">
          Search
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-12"><Loader2 size={28} className="animate-spin text-primary" /></div>
      ) : (
        <>
          <div className="bg-gray-900 rounded-xl border border-gray-800 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-gray-500 text-xs border-b border-gray-800">
                    <th className="text-left px-4 py-3 font-medium">Product</th>
                    <th className="text-left px-4 py-3 font-medium">Category</th>
                    <th className="text-right px-4 py-3 font-medium">MRP</th>
                    <th className="text-right px-4 py-3 font-medium">Price</th>
                    <th className="text-center px-4 py-3 font-medium">Stock</th>
                    <th className="text-center px-4 py-3 font-medium">Featured</th>
                    <th className="text-center px-4 py-3 font-medium">Active</th>
                    <th className="text-left px-4 py-3 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.length === 0 && (
                    <tr><td colSpan={8} className="text-center py-8 text-gray-500">No products found</td></tr>
                  )}
                  {products.map((product) => (
                    <motion.tr
                      key={product.id}
                      layout
                      className="border-t border-gray-800 hover:bg-gray-800/30 transition-colors"
                    >
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-gray-700 overflow-hidden flex-shrink-0">
                            <Image
                              src={product.images[0] ?? DEFAULT_PRODUCT_IMAGE}
                              alt={product.name}
                              width={40} height={40}
                              className="w-full h-full object-contain p-1"
                            />
                          </div>
                          <div>
                            <p className="text-gray-200 font-medium text-xs line-clamp-2 max-w-[180px]">{product.name}</p>
                            <p className="text-gray-500 text-[10px]">SKU: {product.sku}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-gray-400 text-xs">{product.category.name}</td>
                      <td className="px-4 py-3 text-gray-400 text-right text-xs">₹{product.mrp}</td>
                      <td className="px-4 py-3 text-white font-semibold text-right">₹{product.sellingPrice}</td>
                      <td className="px-4 py-3 text-center">
                        <span className={`text-xs font-bold ${product.stock === 0 ? 'text-red-400' : product.stock <= 10 ? 'text-orange-400' : 'text-green-400'}`}>
                          {product.stock}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <button
                          onClick={() => toggleFeatured(product.id, product.isFeatured)}
                          disabled={updating === product.id}
                          className={`text-xs font-medium transition-colors ${product.isFeatured ? 'text-yellow-400' : 'text-gray-600 hover:text-yellow-400'}`}
                        >
                          {product.isFeatured ? '⭐' : '☆'}
                        </button>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <button onClick={() => toggleActive(product.id, product.isActive)} disabled={updating === product.id} className="transition-colors">
                          {updating === product.id
                            ? <Loader2 size={16} className="animate-spin text-gray-400" />
                            : product.isActive
                            ? <ToggleRight size={20} className="text-green-400" />
                            : <ToggleLeft size={20} className="text-gray-600" />}
                        </button>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => openEditModal(product)}
                            className="p-1.5 rounded-lg bg-gray-700 text-gray-300 hover:bg-gray-600 transition-colors"
                          >
                            <Pencil size={12} />
                          </button>
                          <button
                            onClick={() => deleteProduct(product.id, product.name)}
                            className="p-1.5 rounded-lg bg-red-900/50 text-red-400 hover:bg-red-900 transition-colors"
                          >
                            <Trash2 size={12} />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pagination */}
          {pagination && pagination.pages > 1 && (
            <div className="flex justify-center gap-2">
              <button disabled={page === 1} onClick={() => setPage((p) => p - 1)} className="px-3 py-1.5 bg-gray-800 text-gray-300 rounded-lg text-sm disabled:opacity-40 hover:bg-gray-700">← Prev</button>
              <span className="px-3 py-1.5 text-gray-400 text-sm">{page} / {pagination.pages}</span>
              <button disabled={page === pagination.pages} onClick={() => setPage((p) => p + 1)} className="px-3 py-1.5 bg-gray-800 text-gray-300 rounded-lg text-sm disabled:opacity-40 hover:bg-gray-700">Next →</button>
            </div>
          )}
        </>
      )}

      {/* Edit Product Modal */}
      {editingProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <div className="bg-gray-900 border border-gray-800 rounded-2xl w-full max-w-lg p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-gray-800">
              <h2 className="text-lg font-bold text-white">Edit Product</h2>
              <button onClick={() => setEditingProduct(null)} className="text-gray-400 hover:text-white text-sm font-semibold">✕</button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-xs text-gray-400 block mb-1">Product Name</label>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full bg-gray-800 border border-gray-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-primary"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-gray-400 block mb-1">Selling Price (₹)</label>
                  <input
                    type="number"
                    value={editSellingPrice}
                    onChange={(e) => setEditSellingPrice(e.target.value)}
                    className="w-full bg-gray-800 border border-gray-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-primary"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-400 block mb-1">MRP (₹)</label>
                  <input
                    type="number"
                    value={editMrp}
                    onChange={(e) => setEditMrp(e.target.value)}
                    className="w-full bg-gray-800 border border-gray-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-primary"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-gray-400 block mb-1">Stock Quantity</label>
                  <input
                    type="number"
                    value={editStock}
                    onChange={(e) => setEditStock(e.target.value)}
                    className="w-full bg-gray-800 border border-gray-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-primary"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-400 block mb-1">Image URL</label>
                  <input
                    type="text"
                    value={editImage}
                    onChange={(e) => setEditImage(e.target.value)}
                    placeholder="https://..."
                    className="w-full bg-gray-800 border border-gray-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-primary"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-3 border-t border-gray-800">
              <button
                onClick={() => setEditingProduct(null)}
                className="px-4 py-2 bg-gray-800 text-gray-300 rounded-xl text-sm hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveEdit}
                disabled={saving}
                className="flex items-center gap-2 px-5 py-2 bg-primary text-white rounded-xl text-sm font-semibold hover:bg-primary-dark transition-colors disabled:opacity-50"
              >
                {saving && <Loader2 size={14} className="animate-spin" />}
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
