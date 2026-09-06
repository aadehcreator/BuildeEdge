'use client';
import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { useAuthStore } from '@/store/authStore';
import Image from 'next/image';
import { DEFAULT_PRODUCT_IMAGE } from '@/lib/constants';
import { Plus, Loader2, ToggleLeft, ToggleRight, Trash2, PackagePlus, Sparkles, Store, ShieldAlert, ExternalLink, CheckCircle2 } from 'lucide-react';
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

const MATERIAL_PRESETS = [
  {
    label: '🏜️ रेता (River Sand / बजरी)',
    name: 'चंबल की धुली रेता (Washed River Sand for Plaster & Concrete)',
    categoryMatch: 'sand',
    mrp: '4200',
    sellingPrice: '3800',
    unit: 'Trolley (100 Cu.Ft)',
    sku: 'SND-CHM-' + Math.floor(100 + Math.random() * 900),
    stock: '50',
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=600&q=80',
    description: 'सर्वोत्तम गुणवत्ता वाली चंबल की ट्रिपल-स्क्रीन धुली रेता। बिना मिट्टी, प्लास्टर और मजबूत आरसीसी कंक्रीट कार्य के लिए उपयुक्त।',
    tags: 'reta, sand, bajri, chambal, plaster, concrete',
  },
  {
    label: '🧱 ईंटें (Red Clay Bricks / ईंट)',
    name: 'अव्वल लाल भट्ठा ईंटें (Class 1 Kiln-Burnt Red Bricks)',
    categoryMatch: 'brick',
    mrp: '10',
    sellingPrice: '8.5',
    unit: 'Piece',
    sku: 'BRK-AWL-' + Math.floor(100 + Math.random() * 900),
    stock: '15000',
    image: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&w=600&q=80',
    description: 'पक्की अव्वल लाल ईंटें। समान साइज, धारदार किनारे और उच्च मजबूती जो लोड-बेयरिंग दीवारों के लिए सर्वश्रेष्ठ है।',
    tags: 'eats, bricks, int, lal eet, kiln, masonry',
  },
  {
    label: '🏗️ सीमेंट (UltraTech PPC)',
    name: 'UltraTech Super Cement (PPC 50kg)',
    categoryMatch: 'cement',
    mrp: '385',
    sellingPrice: '365',
    unit: 'Bag (50kg)',
    sku: 'CEM-ULT-' + Math.floor(100 + Math.random() * 900),
    stock: '300',
    image: 'https://images.unsplash.com/photo-1590069261209-f8e9b8642343?auto=format&fit=crop&w=600&q=80',
    description: 'इंजीनियर्ड माइक्रो-फाइन सीमेंट, मजबूत नींव, स्लैब ढलाई और दरार-मुक्त निर्माण के लिए।',
    tags: 'cement, ultratech, ppc, dhalai',
  },
  {
    label: '🪨 गिट्टी (Granite Aggregate)',
    name: 'नीली ग्रेनाइट गिट्टी (20mm Blue Granite Aggregate)',
    categoryMatch: 'sand',
    mrp: '4500',
    sellingPrice: '4100',
    unit: 'Trolley (100 Cu.Ft)',
    sku: 'AGG-BLU-' + Math.floor(100 + Math.random() * 900),
    stock: '40',
    image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?auto=format&fit=crop&w=600&q=80',
    description: 'मशीन-क्रश एंगुलर नीली ग्रेनाइट गिट्टी (10mm-20mm)। आरसीसी पिलर, बीम और छत ढलाई में अत्यधिक मजबूती देती है।',
    tags: 'gitti, aggregate, concrete, rola, slab',
  },
];

export default function VendorProductsPage() {
  const { accessToken, setAuth } = useAuthStore();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [notApproved, setNotApproved] = useState(false);
  const [loggingIn, setLoggingIn] = useState(false);

  const fetchProducts = useCallback(async () => {
    if (!accessToken) {
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('/api/vendor/products', {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      if (res.status === 403) { setNotApproved(true); return; }
      if (res.status === 401) { return; }
      setNotApproved(false);
      const data = await res.json() as { products?: Product[] };
      setProducts(data.products ?? []);
    } catch {
      // silent
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

  const handleVendorQuickLogin = async () => {
    setLoggingIn(true);
    try {
      const res = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: '9111111111', otp: '123456' }),
      });
      const data = await res.json();
      if (!res.ok || !data.accessToken) {
        throw new Error(data.error ?? 'Vendor login failed');
      }
      setAuth(data.user, data.accessToken, data.refreshToken);
      document.cookie = `token=${data.accessToken}; path=/; max-age=604800; SameSite=Lax`;
      toast.success('🏢 Logged in as Vendor successfully!');
      fetchProducts();
    } catch (err: any) {
      toast.error(err?.message || 'Login failed');
    } finally {
      setLoggingIn(false);
    }
  };

  const applyPreset = (preset: typeof MATERIAL_PRESETS[0]) => {
    let matchedCatId = '';
    const found = categories.find((c) => c.name.toLowerCase().includes(preset.categoryMatch));
    if (found) matchedCatId = found.id;
    else if (categories.length > 0) matchedCatId = categories[0].id;

    setForm({
      name: preset.name,
      description: preset.description,
      categoryId: matchedCatId,
      brandId: '',
      mrp: preset.mrp,
      sellingPrice: preset.sellingPrice,
      unit: preset.unit,
      sku: preset.sku,
      stock: preset.stock,
      reorderPoint: '10',
      lowStockThreshold: '5',
      images: [preset.image],
      tags: preset.tags,
      cashbackPercent: '1',
    });
    setShowForm(true);
    toast.success(`Preset applied: ${preset.label}`);
  };

  const f = (key: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm((p) => ({ ...p, [key]: e.target.value }));

  const handleSave = async () => {
    if (!accessToken) {
      toast.error('उत्पाद जोड़ने के लिए कृपया पहले वेंडर लॉगिन करें');
      return;
    }
    if (!form.name || !form.categoryId || !form.mrp || !form.sellingPrice || !form.unit || !form.sku) {
      toast.error('उत्पाद का नाम, कैटेगरी, मूल्य और यूनिट अनिवार्य हैं (Fill required fields)');
      return;
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
      toast.success('🎉 उत्पाद सफलतापूर्वक जुड़ गया और लाइव हो गया! (Product is Live)');
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

  return (
    <div className="space-y-5">
      {/* If Not Logged In as Vendor, Show Quick Login */}
      {!accessToken && (
        <div className="bg-amber-950/40 border border-amber-600/40 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <ShieldAlert className="text-amber-400 flex-shrink-0" size={24} />
            <div>
              <p className="text-sm font-semibold text-amber-200">
                Unauthorized / वेंडर लॉगिन आवश्यक है
              </p>
              <p className="text-xs text-amber-300/80">
                उत्पाद (रेता, ईंटें, सीमेंट) जोड़ने व मैनेज करने के लिए वेंडर के रूप में लॉगिन करें।
              </p>
            </div>
          </div>
          <button
            onClick={handleVendorQuickLogin}
            disabled={loggingIn}
            className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-black font-bold text-xs rounded-lg transition-colors flex items-center gap-1.5 flex-shrink-0"
          >
            {loggingIn ? <Loader2 size={14} className="animate-spin" /> : <Store size={14} />}
            1-Click Vendor Login (Sharma Building Materials)
          </button>
        </div>
      )}

      {/* Account Pending Banner */}
      {notApproved && (
        <div className="bg-orange-950/40 border border-orange-600/40 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <p className="text-sm font-semibold text-orange-200">
              ⏳ वेंडर अकाउंट सत्यापन में है (Account Under Review)
            </p>
            <p className="text-xs text-orange-300/80 mt-0.5">
              एडमिन द्वारा अप्रूव होने के बाद आप उत्पाद बेच सकेंगे, या 1-क्लिक टेस्ट वेंडर लॉगिन करें।
            </p>
          </div>
          <button
            onClick={handleVendorQuickLogin}
            disabled={loggingIn}
            className="px-3 py-1.5 bg-orange-500 text-black font-bold text-xs rounded-lg hover:bg-orange-600 flex-shrink-0"
          >
            Switch to Approved Vendor (Sharma)
          </button>
        </div>
      )}

      {/* Header with Title and Add Button */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="font-heading font-bold text-2xl text-white">My Products (वेंडर उत्पाद)</h1>
          <p className="text-gray-400 text-xs mt-0.5">
            Add core materials like Reta (Sand), Eats (Bricks), Cement, and manage prices
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/"
            className="flex items-center gap-1.5 px-3 py-2 bg-gray-800 hover:bg-gray-700 text-gray-200 text-xs font-semibold rounded-xl border border-gray-700 transition-colors"
          >
            <ExternalLink size={14} />
            <span>👀 ग्राहक शॉप पर देखें (View on Shop)</span>
          </Link>
          <button
            onClick={() => {
              setShowForm((v) => !v);
              if (!showForm) setForm(EMPTY_FORM);
            }}
            className="flex items-center gap-1.5 px-4 py-2 bg-primary text-white text-xs sm:text-sm font-bold rounded-xl hover:bg-primary-dark transition-colors shadow-sm"
          >
            <Plus size={16} />
            <span>+ नया उत्पाद जोड़ें (Add Product)</span>
          </button>
        </div>
      </div>

      {/* Quick Presets for Common Construction Materials */}
      <div className="bg-gray-900/80 border border-gray-800 rounded-2xl p-4 space-y-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles size={16} className="text-amber-400" />
            <p className="text-xs font-bold text-white uppercase tracking-wider">
              1-क्लिक मटेरियल प्रीसेट (Quick Presets for Reta, Eats, Cement)
            </p>
          </div>
          <span className="text-[11px] text-gray-400">क्लिक करके तुरंत फॉर्म भरें</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {MATERIAL_PRESETS.map((preset, i) => (
            <button
              key={i}
              onClick={() => applyPreset(preset)}
              className="text-left px-3 py-2.5 rounded-xl bg-gray-800/80 hover:bg-gray-700/80 border border-gray-700/60 hover:border-primary/50 transition-all text-xs group"
            >
              <p className="font-bold text-white group-hover:text-primary transition-colors line-clamp-1">{preset.label}</p>
              <p className="text-gray-400 text-[10px] mt-0.5">₹{preset.sellingPrice} / {preset.unit.split(' ')[0]}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Add Product Form */}
      {showForm && (
        <div className="bg-gray-900 rounded-2xl border border-gray-700 p-5 sm:p-6 space-y-4 shadow-xl">
          <div className="flex items-center justify-between pb-2 border-b border-gray-800">
            <div className="flex items-center gap-2">
              <PackagePlus size={20} className="text-primary" />
              <h2 className="text-white font-bold text-base">नया उत्पाद विवरण (Product Details)</h2>
            </div>
            <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-white text-xs font-medium">
              बंद करें (Close)
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div className="sm:col-span-2">
              <label className={lbl}>Product Name (उत्पाद का नाम) *</label>
              <input value={form.name} onChange={f('name')} placeholder="e.g. चंबल की धुली रेता / UltraTech Cement / अव्वल लाल ईंटें" className={inp} />
            </div>

            <div>
              <label className={lbl}>Category (श्रेणी) *</label>
              <select value={form.categoryId} onChange={f('categoryId')} className={inp}>
                <option value="">कैटेगरी चुनें (Select category)</option>
                {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>

            <div>
              <label className={lbl}>SKU (उत्पाद कोड) *</label>
              <input value={form.sku} onChange={f('sku')} placeholder="e.g. RET-CHM-01, BRK-LAL-01" className={inp} />
            </div>

            <div>
              <label className={lbl}>MRP (अधिकतम खुदरा मूल्य ₹) *</label>
              <input type="number" value={form.mrp} onChange={f('mrp')} placeholder="4200" className={inp} />
            </div>

            <div>
              <label className={lbl}>Selling Price (आपकी बिक्री दर ₹) *</label>
              <input type="number" value={form.sellingPrice} onChange={f('sellingPrice')} placeholder="3800" className={inp} />
            </div>

            <div>
              <label className={lbl}>Unit of Measurement (इकाई) *</label>
              <input value={form.unit} onChange={f('unit')} placeholder="Trolley (100 Cu.Ft) / Piece / Bag (50kg)" className={inp} />
            </div>

            <div>
              <label className={lbl}>Available Stock (उपलब्ध स्टॉक मात्रा)</label>
              <input type="number" value={form.stock} onChange={f('stock')} placeholder="50" className={inp} />
            </div>

            <div className="sm:col-span-2">
              <label className={lbl}>Image URL (उत्पाद की फोटो लिंक)</label>
              <input value={form.images[0]} onChange={(e) => setForm((p) => ({ ...p, images: [e.target.value] }))}
                placeholder="https://images.unsplash.com/photo-..." className={inp} />
            </div>

            <div className="sm:col-span-2">
              <label className={lbl}>Description (विवरण / विशेषताएँ)</label>
              <textarea value={form.description} onChange={f('description')} rows={2}
                placeholder="उत्पाद की गुणवत्ता, उपयोग (प्लास्टर, कंक्रीट, चिनाई) आदि लिखें..." className={`${inp} resize-none`} />
            </div>

            <div className="sm:col-span-2">
              <label className={lbl}>Tags (सर्च टैग - कोमा लगाकर)</label>
              <input value={form.tags} onChange={f('tags')} placeholder="reta, sand, bajri, plaster, cement mix" className={inp} />
            </div>
          </div>

          <div className="flex gap-2 pt-3 border-t border-gray-800">
            <button onClick={handleSave} disabled={saving}
              className="px-6 py-3 bg-primary text-white text-sm font-bold rounded-xl hover:bg-primary-dark transition-colors disabled:opacity-60 flex items-center gap-2 shadow">
              {saving ? <Loader2 size={16} className="animate-spin" /> : <CheckCircle2 size={16} />}
              <span>{saving ? 'Saving Product...' : 'उत्पाद जोड़ें व लाइव करें (Add & Go Live)'}</span>
            </button>
            <button onClick={() => setShowForm(false)}
              className="px-5 py-3 bg-gray-800 text-gray-300 text-sm font-semibold rounded-xl hover:bg-gray-700 transition-colors">
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* How it Appears Explanation Box */}
      <div className="bg-gradient-to-r from-gray-900 to-gray-900/90 border border-gray-800 rounded-2xl p-4 text-xs space-y-2">
        <p className="font-bold text-white flex items-center gap-2">
          <span>📢</span>
          <span>वेंडर का उत्पाद ग्राहकों को कैसे दिखेगा और ऑर्डर कैसे होगा?</span>
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-gray-300">
          <div className="bg-gray-800/60 p-3 rounded-xl border border-gray-700/50">
            <p className="font-semibold text-primary mb-1">1. होम स्क्रीन पर लाइव</p>
            <p className="text-gray-400 text-[11px] leading-relaxed">
              उत्पाद जुड़ते ही होम स्क्रीन पर <b>कोर मैटेरियल्स</b> (रेता, ईंटें, सीमेंट, गिट्टी) सेक्शन में आपकी दुकान के नाम के साथ दिखता है।
            </p>
          </div>
          <div className="bg-gray-800/60 p-3 rounded-xl border border-gray-700/50">
            <p className="font-semibold text-primary mb-1">2. ग्राहक 'Add to Cart' करेगा</p>
            <p className="text-gray-400 text-[11px] leading-relaxed">
              ग्राहक ट्रॉली, बैग या पीस में मात्रा चुनकर सीधे <b>Add to Cart</b> या <b>Order Now</b> कर सकता है।
            </p>
          </div>
          <div className="bg-gray-800/60 p-3 rounded-xl border border-gray-700/50">
            <p className="font-semibold text-primary mb-1">3. वेंडर को सीधा ऑर्डर</p>
            <p className="text-gray-400 text-[11px] leading-relaxed">
              ऑर्डर होते ही वेंडर पैनल के <b>My Orders</b> टैब में डिलीवरी एड्रेस व फोन नंबर के साथ अलर्ट आ जाता है।
            </p>
          </div>
        </div>
      </div>

      {/* Products Table */}
      {loading ? (
        <div className="flex justify-center py-12"><Loader2 size={28} className="animate-spin text-primary" /></div>
      ) : products.length === 0 ? (
        <div className="bg-gray-900 rounded-2xl border border-gray-800 p-12 text-center space-y-3">
          <PackagePlus size={44} className="text-gray-600 mx-auto" />
          <p className="text-white font-bold text-base">अभी कोई उत्पाद नहीं जोड़ा गया है</p>
          <p className="text-gray-400 text-xs max-w-md mx-auto">
            ऊपर दिए गए 1-क्लिक प्रीसेट (जैसे <b>रेता / River Sand</b> या <b>ईंटें / Bricks</b>) पर क्लिक करें और अपना पहला उत्पाद जोड़ें।
          </p>
          <button
            onClick={() => applyPreset(MATERIAL_PRESETS[0])}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-primary hover:bg-primary-dark text-white font-bold text-xs rounded-xl transition-colors"
          >
            <Sparkles size={14} /> रेता (River Sand) जोड़ें
          </button>
        </div>
      ) : (
        <div className="bg-gray-900 rounded-2xl border border-gray-800 overflow-hidden shadow">
          <div className="px-4 py-3 border-b border-gray-800 flex items-center justify-between bg-gray-950/40">
            <h3 className="font-bold text-sm text-white">आपके उत्पाद ({products.length})</h3>
            <span className="text-[11px] text-gray-400">दुकान पर लाइव दिखने के लिए 'Active' रखें</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-gray-400 text-xs border-b border-gray-800 bg-gray-950/50">
                  <th className="text-left px-4 py-3 font-medium">Product (उत्पाद)</th>
                  <th className="text-left px-4 py-3 font-medium">Category</th>
                  <th className="text-right px-4 py-3 font-medium">Price (दर)</th>
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
                        <div className="w-10 h-10 rounded-lg bg-gray-800 overflow-hidden flex-shrink-0 border border-gray-700">
                          <Image src={p.images[0] ?? DEFAULT_PRODUCT_IMAGE} alt={p.name} width={40} height={40} className="w-full h-full object-cover" />
                        </div>
                        <div>
                          <p className="text-gray-200 font-semibold text-xs line-clamp-1 max-w-[200px]">{p.name}</p>
                          <p className="text-gray-500 text-[10px]">SKU: {p.sku}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-400 text-xs">{p.category?.name ?? 'General'}</td>
                    <td className="px-4 py-3 text-white font-bold text-right text-sm">₹{p.sellingPrice} <span className="text-[10px] text-gray-400 font-normal">/{p.unit}</span></td>
                    <td className="px-4 py-3 text-center">
                      <span className={`text-xs font-bold ${p.stock === 0 ? 'text-red-400' : p.stock <= 5 ? 'text-orange-400' : 'text-green-400'}`}>
                        {p.stock}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold ${p.isActive ? 'bg-green-900/50 text-green-300' : 'bg-yellow-900/50 text-yellow-300'}`}>
                        {p.isActive ? '🟢 Live on Shop' : '🟡 Offline'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <button onClick={() => toggleActive(p.id, p.isActive)} title={p.isActive ? 'Click to deactivate' : 'Click to activate'}>
                        {p.isActive ? <ToggleRight size={22} className="text-green-400" /> : <ToggleLeft size={22} className="text-gray-600" />}
                      </button>
                    </td>
                    <td className="px-4 py-3">
                      <button onClick={() => deleteProduct(p.id, p.name)}
                        className="p-1.5 rounded-lg bg-red-900/40 text-red-400 hover:bg-red-900 transition-colors" title="Delete product">
                        <Trash2 size={14} />
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
