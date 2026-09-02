'use client';
import { useEffect, useState, useRef } from 'react';
import { useAuthStore } from '@/store/authStore';
import Image from 'next/image';
import { Plus, Trash2, Loader2, ToggleLeft, ToggleRight, Upload } from 'lucide-react';
import toast from 'react-hot-toast';

interface Banner {
  id: string; image: string; link: string | null; title: string | null;
  subtitle: string | null; sortOrder: number; isActive: boolean;
}

export default function AdminBannersPage() {
  const { accessToken } = useAuthStore();
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [form, setForm] = useState({ image: '', link: '', title: '', subtitle: '', sortOrder: 0 });
  const fileRef = useRef<HTMLInputElement>(null);

  const fetchBanners = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/banners', { headers: { Authorization: `Bearer ${accessToken}` } });
      const data = await res.json() as { banners: Banner[] };
      setBanners(data.banners ?? []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchBanners(); }, [accessToken]);

  const handleUpload = async (file: File) => {
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append('file', file);
      fd.append('folder', 'buildedge/banners');
      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        headers: { Authorization: `Bearer ${accessToken}` },
        body: fd,
      });
      const data = await res.json() as { url?: string; error?: string };
      if (!res.ok) throw new Error(data.error ?? 'Upload failed');
      setForm((f) => ({ ...f, image: data.url! }));
      toast.success('Image uploaded!');
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    if (!form.image) { toast.error('Image is required'); return; }
    setSaving(true);
    try {
      const res = await fetch('/api/admin/banners', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${accessToken}` },
        body: JSON.stringify({ ...form, sortOrder: Number(form.sortOrder), isActive: true }),
      });
      if (!res.ok) throw new Error('Failed');
      toast.success('Banner created!');
      setShowForm(false);
      setForm({ image: '', link: '', title: '', subtitle: '', sortOrder: 0 });
      fetchBanners();
    } catch {
      toast.error('Failed to create banner');
    } finally {
      setSaving(false);
    }
  };

  const toggleActive = async (id: string, current: boolean) => {
    try {
      await fetch('/api/admin/banners', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${accessToken}` },
        body: JSON.stringify({ id, isActive: !current }),
      });
      setBanners((prev) => prev.map((b) => b.id === id ? { ...b, isActive: !current } : b));
    } catch {
      toast.error('Failed');
    }
  };

  const deleteBanner = async (id: string) => {
    if (!confirm('Delete this banner?')) return;
    try {
      await fetch(`/api/admin/banners?id=${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      setBanners((prev) => prev.filter((b) => b.id !== id));
      toast.success('Banner deleted');
    } catch {
      toast.error('Failed to delete');
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="font-heading font-bold text-2xl text-white">Banners</h1>
        <button
          onClick={() => setShowForm((v) => !v)}
          className="flex items-center gap-1.5 px-3 py-2 bg-primary text-white text-sm font-semibold rounded-xl hover:bg-primary-dark transition-colors"
        >
          <Plus size={14} /> Add Banner
        </button>
      </div>

      {/* Add form */}
      {showForm && (
        <div className="bg-gray-900 rounded-xl border border-gray-700 p-4 space-y-3">
          <h2 className="text-white font-semibold text-sm">New Banner</h2>

          {/* Image upload */}
          <div>
            {form.image ? (
              <div className="relative w-full h-32 rounded-lg overflow-hidden">
                <Image src={form.image} alt="Banner preview" fill className="object-cover" />
                <button onClick={() => setForm((f) => ({ ...f, image: '' }))} className="absolute top-2 right-2 w-6 h-6 bg-red-500 rounded-full text-white text-xs flex items-center justify-center">×</button>
              </div>
            ) : (
              <button
                onClick={() => fileRef.current?.click()}
                disabled={uploading}
                className="w-full h-32 border-2 border-dashed border-gray-700 rounded-lg flex flex-col items-center justify-center gap-2 hover:border-primary transition-colors text-gray-500 hover:text-primary"
              >
                {uploading ? <Loader2 size={20} className="animate-spin" /> : <Upload size={20} />}
                <span className="text-xs font-medium">{uploading ? 'Uploading...' : 'Click to upload banner image'}</span>
              </button>
            )}
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={(e) => { if (e.target.files?.[0]) handleUpload(e.target.files[0]); }} />
            <p className="text-xs text-gray-500 mt-1">Or paste URL:</p>
            <input value={form.image} onChange={(e) => setForm((f) => ({ ...f, image: e.target.value }))}
              placeholder="https://..."
              className="w-full px-3 py-2 text-sm bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-primary mt-1"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <input value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
              placeholder="Banner title"
              className="px-3 py-2 text-sm bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-primary"
            />
            <input value={form.subtitle} onChange={(e) => setForm((f) => ({ ...f, subtitle: e.target.value }))}
              placeholder="Subtitle"
              className="px-3 py-2 text-sm bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-primary"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <input value={form.link} onChange={(e) => setForm((f) => ({ ...f, link: e.target.value }))}
              placeholder="Link (e.g. /collections/paint)"
              className="px-3 py-2 text-sm bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-primary"
            />
            <input type="number" value={form.sortOrder} onChange={(e) => setForm((f) => ({ ...f, sortOrder: Number(e.target.value) }))}
              placeholder="Sort order"
              className="px-3 py-2 text-sm bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-primary"
            />
          </div>
          <div className="flex gap-2">
            <button onClick={handleSave} disabled={saving || uploading}
              className="px-4 py-2 bg-primary text-white text-sm font-semibold rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-60 flex items-center gap-2"
            >
              {saving ? <Loader2 size={14} className="animate-spin" /> : null} Save Banner
            </button>
            <button onClick={() => setShowForm(false)} className="px-4 py-2 bg-gray-700 text-gray-300 text-sm rounded-lg hover:bg-gray-600">Cancel</button>
          </div>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-12"><Loader2 size={28} className="animate-spin text-primary" /></div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {banners.map((banner) => (
            <div key={banner.id} className={`bg-gray-900 rounded-xl border overflow-hidden ${banner.isActive ? 'border-gray-700' : 'border-gray-800 opacity-60'}`}>
              <div className="relative aspect-[16/5] bg-gray-800">
                <Image src={banner.image} alt={banner.title ?? 'Banner'} fill className="object-cover" />
                {!banner.isActive && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <span className="text-xs text-gray-300 font-semibold bg-gray-800 px-2 py-1 rounded">HIDDEN</span>
                  </div>
                )}
              </div>
              <div className="p-3">
                <p className="text-gray-200 text-sm font-semibold line-clamp-1">{banner.title ?? 'Untitled Banner'}</p>
                {banner.subtitle && <p className="text-gray-500 text-xs mt-0.5 line-clamp-1">{banner.subtitle}</p>}
                {banner.link && <p className="text-primary text-xs mt-0.5 font-mono line-clamp-1">{banner.link}</p>}
                <div className="flex items-center justify-between mt-3">
                  <span className="text-gray-600 text-xs">Order: {banner.sortOrder}</span>
                  <div className="flex items-center gap-2">
                    <button onClick={() => toggleActive(banner.id, banner.isActive)} title="Toggle active">
                      {banner.isActive
                        ? <ToggleRight size={20} className="text-green-400" />
                        : <ToggleLeft size={20} className="text-gray-600" />}
                    </button>
                    <button onClick={() => deleteBanner(banner.id)} className="p-1 text-red-500 hover:bg-red-900/30 rounded transition-colors">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
          {banners.length === 0 && (
            <div className="col-span-3 text-center py-12 text-gray-500">No banners yet. Add your first banner above.</div>
          )}
        </div>
      )}
    </div>
  );
}
